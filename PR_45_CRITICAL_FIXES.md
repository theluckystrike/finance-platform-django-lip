ETF Scraper Implementation Fixes

Pull Request 45



Migration Correction

Create a new migration file
backend/databaseinterface/migrations/0016_fix_etfmembersdata_indexes.py

```python
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('databaseinterface', '0015_etfmembersdata'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='etfmembersdata',
            unique_together={('etf_ticker', 'date', 'ticker')},
        ),
        
        migrations.AddIndex(
            model_name='etfmembersdata',
            index=models.Index(fields=['etf_ticker', 'date'], 
                              name='databaseint_etf_tic_1234ab_idx'),
        ),
        
        migrations.AddIndex(
            model_name='etfmembersdata',
            index=models.Index(fields=['ticker'], 
                              name='databaseint_ticker_5678cd_idx'),
        ),
        
        migrations.AlterModelOptions(
            name='etfmembersdata',
            options={'verbose_name': 'ETF Members List Data', 
                    'verbose_name_plural': 'ETF Members List Data'},
        ),
    ]
```



Model Updates

Modify backend/databaseinterface/models.py

```python
class ETFMembersData(models.Model):
    etf_ticker = models.CharField(max_length=10)
    date = models.DateField()
    ticker = models.CharField(max_length=10)
    name = models.CharField(max_length=72)
    sector = models.CharField(max_length=30)
    weight = models.FloatField(default=0.0, null=True, blank=True)
    shares_held = models.FloatField(default=0.0, null=True, blank=True)
    identifier = models.CharField(max_length=50)
    local_currency = models.CharField(max_length=3)
    sedol = models.CharField(max_length=7)

    class Meta:
        indexes = [
            models.Index(fields=["etf_ticker", "date"]),
            models.Index(fields=["ticker"]),
        ]
        unique_together = (("etf_ticker", "date", "ticker"),)
        verbose_name = "ETF Members List Data"
        verbose_name_plural = "ETF Members List Data"

    def __str__(self):
        return f"{self.etf_ticker} - {self.ticker} {self.date}"
```



Terraform Configuration

Update terraform/10_cloudwatch_events.tf

```hcl
resource "aws_cloudwatch_event_rule" "scrape_holdings" {
  name                = "scrape-holdings-daily"
  description         = "Daily run of scrape_holdings ECS task"
  schedule_expression = "cron(0 4 * * ? *)"
}

resource "aws_cloudwatch_event_target" "scrape_holdings" {
  rule     = aws_cloudwatch_event_rule.scrape_holdings.name
  arn      = aws_ecs_cluster.production.arn
  role_arn = aws_iam_role.ecs_events_role.arn

  ecs_target {
    task_definition_arn = aws_ecs_task_definition.scrape.arn
    task_count          = 1
    launch_type         = "FARGATE"
    
    network_configuration {
      subnets          = [aws_subnet.public_subnet_1.id, 
                         aws_subnet.public_subnet_2.id]
      security_groups  = [aws_security_group.ecs_security_group.id]
      assign_public_ip = true
    }
    platform_version = "LATEST"
  }
}
```



Dependencies

Add to backend/requirements.txt

```
pandas==2.0.3
openpyxl==3.1.2
```



Enhanced Error Handling

Update backend/databaseinterface/management/commands/scrape_holdings.py

```python
import tempfile
import os
from contextlib import contextmanager

@contextmanager
def temporary_file(suffix=".xlsx"):
    temp_file = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
    temp_path = temp_file.name
    temp_file.close()
    try:
        yield temp_path
    finally:
        try:
            os.remove(temp_path)
        except OSError:
            pass

def download_and_parse_holdings_table(url, download_path):
    
    try:
        resp = requests.get(url, stream=True, timeout=30)
        resp.raise_for_status()
    except requests.Timeout:
        logger.error(f"Timeout downloading {url}")
        raise
    except requests.RequestException as e:
        logger.error(f"Failed to download {url}: {e}")
        raise
    
    total_size = 0
    with open(download_path, "wb") as f:
        for chunk in resp.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
                total_size += len(chunk)
    
    logger.info(f"Downloaded {total_size:,} bytes from {url}")
    
    try:
        df = pd.read_excel(download_path, sheet_name="holdings", header=4)
    except ValueError as e:
        if "Worksheet named 'holdings' not found" in str(e):
            logger.error(f"Excel file from {url} missing holdings sheet")
            raise
        logger.error(f"Failed to parse Excel from {url}: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error parsing {url}: {e}")
        raise
    
    if df.empty:
        logger.warning(f"Empty dataframe from {url}")
        return df
    
    required_columns = ["Ticker", "Identifier", "Weight"]
    missing_cols = [col for col in required_columns if col not in df.columns]
    if missing_cols:
        logger.error(f"Missing required columns {missing_cols}")
        raise ValueError(f"Missing required columns: {missing_cols}")
    
    df = df.dropna(how="all")
    df = df.dropna(how="all", subset=required_columns)
    df = df[df["Ticker"] != "-"]
    
    cols = [c.lower().strip().replace(" ", "_") for c in df.columns.tolist()]
    df.columns = cols
    
    try:
        etf_ticker = url.split('-')[-1].split('.')[0].upper()
        if not etf_ticker or len(etf_ticker) > 10:
            raise ValueError("Invalid ticker format")
    except Exception as e:
        etf_ticker = "UNKNOWN"
        logger.warning(f"Could not derive ticker from {url}: {e}")
    
    df["etf_ticker"] = etf_ticker
    df["date"] = datetime.now().date()
    
    logger.info(f"Parsed {len(df)} holdings for {etf_ticker}")
    return df
```



Testing Process


Apply migrations

```bash
cd backend
python manage.py makemigrations databaseinterface
python manage.py migrate
```


Install dependencies

```bash
pip install -r requirements.txt
```


Test the scraper

```bash
python manage.py scrape_holdings --dry-run
python manage.py scrape_holdings --etf XLI --dry-run
python manage.py scrape_holdings --etf XLI
```


Validate infrastructure

```bash
cd ../terraform
terraform fmt
terraform validate
terraform plan
```


Verify admin interface

```bash
python manage.py runserver
```

Navigate to /admin/databaseinterface/etfmembersdata/



Deployment


Deploy backend changes first

Run database migrations on production

Test scraper manually in production environment

Apply Terraform changes to enable scheduling

Monitor CloudWatch logs for first automated execution

Verify data appears correctly in admin interface



Rollback Plan


Disable the CloudWatch event if issues arise

```bash
aws events disable-rule --name scrape-holdings-daily
```


Remove CloudWatch resources via Terraform

```bash
terraform destroy -target=aws_cloudwatch_event_rule.scrape_holdings
terraform destroy -target=aws_cloudwatch_event_target.scrape_holdings
```


Revert model changes and migrations if necessary



Validation


Migrations execute without errors

SSGA files download and parse correctly

Database constraints work as expected

Terraform configuration validates

CloudWatch events trigger on schedule

Admin interface displays data properly

Temporary files are cleaned up

Error messages appear in logs appropriately