# Integration Data Collection System

## Overview
This system collects data from all integration providers (GitHub, Fitbit, Wakapi, LeetCode) for all users and stores it in the `daily_stats` and `daily_stat_metrics` tables. This approach avoids API rate limits by collecting data every 15 minutes via cron jobs.

## Files Created/Modified

### 1. Job: `app/Jobs/CollectUserIntegrationData.php`
**Purpose**: Main job that collects data from all integration providers for all users
**Features**:
- Iterates through all users with integrations
- Collects data from GitHub, Fitbit, Wakapi, and LeetCode
- Stores data in `daily_stats` and `daily_stat_metrics` tables
- Comprehensive error handling and logging
- Supports custom date collection

**Data Collected**:
- **GitHub**: commits, repositories, contributions
- **Fitbit**: steps, distance, calories  
- **Wakapi**: coding_time, languages_count, projects_count
- **LeetCode**: problems_solved_easy/medium/hard, submissions_today, ranking

### 2. Console Command: `app/Console/Commands/CollectIntegrationsData.php`
**Purpose**: Artisan command to dispatch the data collection job
**Usage**: `php artisan integrations:collect [date]`
**Features**:
- Accepts optional date parameter
- Dispatches job to queue
- Suitable for cron scheduling

### 3. Console Command: `app/Console/Commands/RunDataCollectionJob.php`  
**Purpose**: Artisan command for testing and manual execution
**Usage**: `php artisan integrations:run-collection [date] [--sync]`
**Features**:
- Can run synchronously or async
- Useful for testing and debugging
- Progress indicators

### 4. Scheduler: `routes/console.php`
**Added**: `Schedule::command('integrations:collect')->everyFifteenMinutes();`
**Purpose**: Automatically runs data collection every 15 minutes

### 5. Additional Request: `app/Http/Integrations/Fitbit/Requests/GetUserActivitiesRequest.php`
**Purpose**: API request class for detailed Fitbit activities data

## Database Structure

### daily_stats table
- `user_id`: User ID
- `date`: Collection date (Y-m-d format)
- `provider`: Integration provider (github, fitbit, wakapi, leetcode)
- `meta`: Additional metadata (JSON)

### daily_stat_metrics table  
- `daily_stat_id`: Foreign key to daily_stats
- `type`: Metric type (steps, commits, coding_time, etc.)
- `value`: Metric value (numeric)
- `unit`: Unit of measurement (count, seconds, meters, etc.)
- `meta`: Additional metadata (JSON)

## Usage Examples

### Manual Collection
```bash
# Collect data for today
php artisan integrations:collect

# Collect data for specific date
php artisan integrations:collect 2025-07-31

# Run synchronously for testing
php artisan integrations:run-collection --sync
```

### Cron Setup
The scheduler is already configured to run every 15 minutes. To enable:
```bash
# Add to crontab
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

### Queue Processing
Since the job implements `ShouldQueue`, ensure queue workers are running:
```bash
php artisan queue:work
```

## API Integration Points

### Current Implementation Status
- ✅ **Structure**: Complete job structure with all providers
- ✅ **Fitbit**: Uses existing `getUserStepsAndStore()` method
- ⚠️ **GitHub**: Placeholder methods (need API implementation)
- ⚠️ **Wakapi**: Placeholder methods (need API implementation)  
- ⚠️ **LeetCode**: Placeholder methods (need API implementation)

### Next Steps for Full Implementation
1. Implement GitHub API calls for commits, repos, contributions
2. Implement Wakapi API calls for coding stats
3. Implement LeetCode API calls for problem stats
4. Add more detailed Fitbit metrics (distance, calories)

## Benefits
- **Rate Limit Avoidance**: Data collected via cron, not on user requests
- **Performance**: Frontend loads pre-aggregated data quickly
- **Scalability**: Works with unlimited users
- **Reliability**: Continues working even if external APIs are temporarily down
- **Historical Data**: Maintains daily snapshots for trending

## Monitoring
- Check logs in `storage/logs/laravel.log` for collection status
- Monitor queue status: `php artisan queue:monitor`
- Database metrics show collection success/failure rates
