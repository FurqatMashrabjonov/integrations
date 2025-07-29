<?php

Illuminate\Support\Facades\Schedule::command('fitbit:get-user-steps')->everyFifteenMinutes();
Schedule::command('leetcode:sync-profiles')->everyFifteenMinutes();
