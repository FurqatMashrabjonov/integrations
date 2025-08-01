<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('fitbit:get-user-steps')->everyFifteenMinutes();
Schedule::command('leetcode:sync-profiles')->everyFifteenMinutes();
Schedule::command('integrations:collect')->everyFifteenMinutes();
