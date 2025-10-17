Bug Fixes Sprint 3: Script Monitoring Enhancement
===================================================

Investigation Summary
---------------------

The investigation was initiated to determine why certain data processing scripts were not updating reliably. Two specific scripts were identified as problematic: "NYSE HiLo Logic Index Tape Summary" and "NYSE AD Line ATH".

Key Findings:

- The hourly batch runner in `batchrunscripts.py` only processes 10 scripts per execution. With a large number of scripts in the system, this creates a bottleneck where some scripts may not be updated for extended periods.

- When a script fails, its `last_updated` timestamp is still set to the current time. This prevents the script from being retried by the batch system for another 24 hours, even though it produced no valid output.

- The Terraform configuration shows that the daily full script update job scheduled for 10am UTC is currently disabled with `is_enabled = false`. This was likely a backup mechanism to ensure all scripts run at least once per day.

- Analysis of the script runner revealed multiple failure modes including Python exceptions, missing output from no `savefig()` or `to_csv()` calls, and external data source unavailability.

Solution Implemented
--------------------

Backend Enhancements

New API Query Parameters were added to the `/api/scripts/` endpoint in `backend/olandinvestmentsapi/views/script_views.py` to enable filtering for problematic scripts. The parameters include `stale_hours` which filters scripts that have not been updated within the specified number of hours, and `problems` which is a boolean flag that returns scripts with either `status=failure` OR stale updates. Combined usage with `problems=true&stale_hours=48` returns all problematic scripts.

Implementation Logic:

```python
if problems and problems.lower() == 'true':
    stale_threshold_hours = int(stale_hours) if stale_hours else 48
    stale_time = timezone.now() - timezone.timedelta(hours=stale_threshold_hours)
    
    queryset = queryset.filter(
        Q(status=Script.ExecutionStatus.FAILURE) |
        Q(last_updated__lt=stale_time) |
        Q(last_updated__isnull=True)
    )
```

Enhanced Serializer in `backend/olandinvestmentsapi/serializers.py` now includes three new fields added to `ScriptSerializerLite` to provide detailed script status information. The `is_stale` field is a boolean indicating if the script has not been updated in over 48 hours. The `hours_since_update` field is a numeric value representing hours since last update or `null` if never updated. The `error_message` field contains the full error message text for scripts with `status=failure`.

```python
def get_is_stale(self, obj):
    from django.utils import timezone
    if obj.last_updated is None:
        return True
    stale_threshold = timezone.now() - timezone.timedelta(hours=48)
    return obj.last_updated < stale_threshold

def get_hours_since_update(self, obj):
    from django.utils import timezone
    if obj.last_updated is None:
        return None
    delta = timezone.now() - obj.last_updated
    return round(delta.total_seconds() / 3600, 1)
```

Frontend Enhancements

Redesigned Error Monitoring Page in `frontend/src/pages/ErrorHandling/ErrorHandle.tsx` received several updates to improve visibility of problematic scripts. The page title was changed from "Error Handle script by status failure" to "Scripts with Errors & Not Updating" to reflect the expanded scope. The API call was updated to use the new parameters with `problems=true&stale_hours=48`. A new "Issue" column was added to the table displaying status badges with visual indicators.

Visual Status Indicators were implemented to distinguish between different script states. A red badge labeled "Error" indicates scripts with `status=failure` from execution errors, with a hover tooltip displaying the full error message. A yellow badge labeled "Stale" indicates scripts not updated in 48+ hours, with a hover tooltip showing exact hours since last update. A gray badge labeled "OK" appears for scripts that are current and functioning properly.

Updated API Client in `frontend/src/Redux/Script/ScriptApi.tsx` was refactored to support dynamic query parameter construction. The `GetScriptbyCategory` function now uses `URLSearchParams` for cleaner parameter handling.

```typescript
const params = new URLSearchParams();
params.append('page', '1');

if (value?.problems) {
  params.append('problems', value.problems);
  if (value?.stale_hours) {
    params.append('stale_hours', value.stale_hours);
  }
} else if (value?.status && value.status !== '') {
  params.append('status', value.status === 'all' ? '' : value.status);
}
```

How to Debug / Verify
---------------------

To investigate specific scripts like "NYSE HiLo Logic Index Tape Summary" and "NYSE AD Line ATH":

- Navigate to the "Scripts with Errors & Not Updating" page in the application UI

- Locate the script in the table and check the "Issue" badge where red indicates execution failure and yellow indicates the script has not updated recently

- Hover over the badge to see detailed information where error badges show the error message and stale badges show hours since last update

- Execute the following SQL query for database-level debugging:

```sql
SELECT name, status, last_updated, error_message, created
FROM scriptupload_script 
WHERE name LIKE '%NYSE HiLo%' OR name LIKE '%NYSE AD Line ATH%'
ORDER BY last_updated DESC;
```

- Manually trigger a script execution via Django shell:

```python
from scriptupload.models import Script
script = Script.objects.get(name="NYSE HiLo Logic Index Tape Summary")
script.run()
```

- Check CloudWatch logs in production or console output locally for execution details:

```
[script runner] Running script * NYSE HiLo Logic Index Tape Summary *
[script runner] Failed to run script * NYSE HiLo Logic Index Tape Summary * with error ->
```

Common failure causes to investigate:

- External data source unavailability such as NYSE data feed issues
- Date and time filtering logic excluding current market conditions
- Column name changes in upstream data sources
- Missing Python package dependencies

Recommendations
---------------

Immediate Actions

- Re-enable Daily Full Script Update by modifying `terraform/10_cloudwatch_events.tf` line 5 to change `is_enabled = false` to `is_enabled = true`. This ensures all scripts execute at least once per day regardless of batch processing delays.

- Increase Hourly Batch Size in `backend/scriptupload/management/commands/batchrunscripts.py` by increasing the default batch size from 10 to 20-30 scripts:

```python
parser.add_argument("-b", dest="batch_size",
                    default=20, type=int, action='store')
```

- Implement Script-Specific Retry Logic by adding immediate retry capability for scripts that fail due to transient errors such as network timeouts or temporary API unavailability.

Long-term Improvements

- Script Health Dashboard should be built to display success rate per script over time, average execution duration trends, failure categorization distinguishing transient versus permanent errors, and alert configuration for repeated failures.

- Smart Scheduling System should be implemented with intelligent script scheduling that runs market-related scripts only during market hours, prioritizes critical scripts in the batch queue, and adjusts update frequency based on data source refresh rates.

- Dependency Mapping should create comprehensive documentation of which scripts depend on which external data sources, health check endpoints for external APIs, and fallback strategies when primary data sources fail.

- Error Categorization should implement automatic error classification where transient errors trigger immediate retry with exponential backoff and permanent errors alert for developer intervention.

Testing the Changes
-------------------

Backend Testing

Get all problematic scripts with errors OR stale status:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/scripts/?problems=true&stale_hours=48"
```

Get only stale scripts:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/scripts/?stale_hours=24"
```

Get only error scripts using original behavior:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/scripts/?status=failure"
```

Verify response includes new fields:

```json
{
  "results": [
    {
      "id": 123,
      "name": "NYSE HiLo Logic Index Tape Summary",
      "status": "failure",
      "is_stale": true,
      "hours_since_update": 72.3,
      "error_message": "KeyError: 'HL_RATIO'"
    }
  ]
}
```

Frontend Testing

Manual Testing Checklist:

- Navigate to "Scripts with Errors & Not Updating" page
- Verify the page displays scripts with both error and stale statuses
- Check that the "Issue" column shows appropriate badges with red "Error" badges for failed scripts and yellow "Stale" badges for scripts not updated in 48+ hours
- Hover over each badge type and verify tooltips display correctly where error tooltips show error messages and stale tooltips show hours since update
- Test table sorting functionality on all columns including the new "Issue" column
- Verify script name links navigate to the correct script detail pages
- Test pagination with large result sets
- Verify checkbox selection works correctly for batch operations

Expected Outcomes:

- Page loads within 2 seconds with typical result set of 50-100 scripts
- All visual indicators render correctly across browsers including Chrome, Firefox, and Safari
- No console errors appear in browser developer tools
- Responsive layout maintains readability on tablet and desktop viewports

Files Modified
--------------

- `backend/olandinvestmentsapi/views/script_views.py` - Added `stale_hours` and `problems` query parameters to `ScriptViewSet.get_queryset()` method with enhanced filtering logic to support combined error and staleness detection.

- `backend/olandinvestmentsapi/serializers.py` - Extended `ScriptSerializerLite` with three new computed fields including `is_stale`, `hours_since_update`, and `error_message`, and added these fields to Meta class fields list.

- `frontend/src/pages/ErrorHandling/ErrorHandle.tsx` - Updated page title, modified API call parameters to use `problems=true&stale_hours=48`, and added new "Issue" table column with conditional badge rendering and tooltips.

- `frontend/src/Redux/Script/ScriptApi.tsx` - Refactored `GetScriptbyCategory` function to dynamically construct query parameters using `URLSearchParams` with added support for `problems` and `stale_hours` parameters.

Related Documentation
---------------------

Key Files for Context:

- `backend/scriptupload/models/script.py` - Script model definition including ExecutionStatus enum
- `backend/scriptupload/utils/runners.py` - Script execution engine and error handling logic
- `backend/scriptupload/management/commands/batchrunscripts.py` - Hourly batch update implementation
- `backend/scriptupload/management/commands/runallscripts.py` - Full script update implementation
- `terraform/10_cloudwatch_events.tf` - Scheduled job configuration for script updates

Related Models:

- `Script` - Primary model with fields including `name`, `status`, `last_updated`, `error_message`, and `category`
- `Category` - Script categorization with parent-child hierarchy
- `Report` - Aggregates multiple scripts into PDF reports
- `Summary` - Tape summaries combining multiple script signals