# Script Update Investigation & Error Monitoring Enhancement

## Investigation Summary

### Why Some Scripts Are Not Updating

After investigating the codebase, I identified several reasons why scripts like "NYSE HiLo Logic Index Tape Summary" and "NYSE AD Line ATH" might not be updating:

#### 1. **Batch Update Limitations**
- **Location**: `backend/scriptupload/management/commands/batchrunscripts.py`
- **Issue**: The batch runner only processes 10 scripts per run (default batch_size)
- **Impact**: If many scripts are stale, it takes multiple runs to cycle through all scripts
- **Query Logic**: Selects scripts where `last_updated < 24 hours ago` OR `last_updated IS NULL`

```python
scripts_to_run = Script.objects.filter(
    Q(last_updated__lt=twenty_four_hours_ago) | Q(last_updated__isnull=True)
)[:batch_size]  # Only takes first 10
```

#### 2. **Script Execution Failures**
- **Location**: `backend/scriptupload/utils/runners.py`
- Scripts can fail for several reasons:
  - **Python exceptions** during execution → `status=FAILURE` 
  - **No output generated** → `status=FAILURE` with message "Could not find an output"
  - **Missing data dependencies** → Script runs but produces no usable output
  - **API/data source issues** → External data unavailable

#### 3. **Failed Scripts Still Get Updated**
- When a script fails, `last_updated` is still set to current time
- This means failed scripts won't be retried by batch updates for another 24 hours
- They remain in `status=FAILURE` state but are considered "recently updated"

#### 4. **Update Scheduling**
- **Batch updates**: Run every hour (terraform/10_cloudwatch_events.tf line 29)
- **Daily full update**: Runs at 10am UTC but is currently **DISABLED** (line 5: `is_enabled = false`)

## Solution Implemented

### Backend Enhancements

#### 1. New API Query Parameters (`backend/olandinvestmentsapi/views/script_views.py`)

Added three new query parameters to the `/api/scripts/` endpoint:

**`stale_hours`**: Filter scripts that haven't been updated in X hours
```
GET /api/scripts/?stale_hours=48
# Returns scripts not updated in last 48 hours
```

**`problems`**: Filter scripts with either errors OR stale updates
```
GET /api/scripts/?problems=true&stale_hours=48
# Returns scripts with status=failure OR not updated in 48 hours
```

**Implementation**:
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

#### 2. Enhanced Script Serializer (`backend/olandinvestmentsapi/serializers.py`)

Added new fields to `ScriptSerializerLite`:

- **`is_stale`**: Boolean indicating if script hasn't updated in 48+ hours
- **`hours_since_update`**: Numeric value showing hours since last update
- **`error_message`**: Error details for failed scripts

### Frontend Enhancements

#### 1. Updated Error Tab (`frontend/src/pages/ErrorHandling/ErrorHandle.tsx`)

**Changes**:
- **Title**: Changed from "Error Handle script by status failure" to "Scripts with Errors & Not Updating"
- **API Call**: Now uses `problems=true&stale_hours=48` instead of just `status=failure`
- **New Column**: Added "Issue" column showing script status

**Visual Indicators**:
- 🔴 **Red Badge "Error"**: Scripts with `status=failure` (actual execution errors)
- 🟡 **Yellow Badge "Stale"**: Scripts not updated in 48+ hours (stale/not updating)
- ⚪ **Gray Badge "OK"**: Scripts that are up-to-date

**Tooltip Information**:
- Error badge: Shows the error message on hover
- Stale badge: Shows hours since last update on hover

#### 2. Updated API Client (`frontend/src/Redux/Script/ScriptApi.tsx`)

Enhanced `GetScriptbyCategory` to support new parameters:
```typescript
if (value?.problems) {
  params.append('problems', value.problems);
  if (value?.stale_hours) {
    params.append('stale_hours', value.stale_hours);
  }
}
```

## How to Debug Specific Scripts

### For "NYSE HiLo Logic Index Tape Summary" and "NYSE AD Line ATH"

1. **Check Script Status in Database**:
```sql
SELECT name, status, last_updated, error_message 
FROM scriptupload_script 
WHERE name LIKE '%NYSE HiLo%' OR name LIKE '%NYSE AD Line ATH%';
```

2. **Check Script Logs**:
Look for log entries in CloudWatch (production) or console (local):
```
[script runner] Running script * NYSE HiLo Logic Index Tape Summary *
[script runner] Failed to run script * NYSE HiLo Logic Index Tape Summary * with error ->
```

3. **Manually Run Script** (via Django shell):
```python
from scriptupload.models import Script
script = Script.objects.get(name="NYSE HiLo Logic Index Tape Summary")
script.run()  # Queue it for execution
```

4. **Check in UI**:
- Navigate to the "Scripts with Errors & Not Updating" page
- Look for the specific script
- Check the "Issue" badge (Error vs Stale)
- Hover over badge to see details

5. **Common Issues to Check**:
   - **Data Source**: Is the underlying data (NYSE data) being updated?
   - **Dependencies**: Does the script depend on external APIs that might be down?
   - **Date Logic**: Does the script filter for market hours/days?
   - **Column Names**: Has the source data format changed?

## Recommendations

### Immediate Actions

1. **Enable Daily Full Script Update**:
   - Edit `terraform/10_cloudwatch_events.tf` line 5
   - Change `is_enabled = false` to `is_enabled = true`
   - This ensures all scripts run at least once per day

2. **Increase Batch Size for Hourly Updates**:
   ```python
   # In batchrunscripts.py, increase default from 10 to 20-30
   parser.add_argument("-b", dest="batch_size",
                       default=20, type=int, action='store')
   ```

3. **Add Retry Logic for Failed Scripts**:
   - Consider automatically re-running scripts that failed due to transient errors
   - Add exponential backoff for repeated failures

### Long-term Improvements

1. **Script Health Dashboard**:
   - Add metrics for script success rate
   - Track average execution time
   - Alert on repeated failures

2. **Dependency Management**:
   - Document which scripts depend on which data sources
   - Add health checks for external data sources

3. **Smart Scheduling**:
   - Run market-related scripts only during market hours
   - Prioritize critical scripts in batch updates

4. **Error Categorization**:
   - Distinguish between transient errors (retry immediately)
   - And permanent errors (needs code fix)

## Testing the Changes

### Backend Testing

Test the new API parameters:
```bash
# Get scripts with problems (errors OR stale)
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/scripts/?problems=true&stale_hours=48"

# Get only stale scripts
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/scripts/?stale_hours=24"

# Get only error scripts (original behavior)
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/scripts/?status=failure"
```

### Frontend Testing

1. Navigate to the "Scripts with Errors & Not Updating" page
2. Verify you see both:
   - Scripts with red "Error" badges
   - Scripts with yellow "Stale" badges
3. Hover over badges to see tooltips
4. Verify sorting works correctly
5. Check that script names link properly

## Files Modified

### Backend
- `backend/olandinvestmentsapi/views/script_views.py` - Added query parameters
- `backend/olandinvestmentsapi/serializers.py` - Enhanced serializer with stale indicators

### Frontend
- `frontend/src/pages/ErrorHandling/ErrorHandle.tsx` - Updated UI and filtering
- `frontend/src/Redux/Script/ScriptApi.tsx` - Updated API client

## Related Documentation

- Batch update logic: `backend/scriptupload/management/commands/batchrunscripts.py`
- Script execution: `backend/scriptupload/utils/runners.py`
- Scheduled jobs: `terraform/10_cloudwatch_events.tf`
- Script model: `backend/scriptupload/models/script.py`
