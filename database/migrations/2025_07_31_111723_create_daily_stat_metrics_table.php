<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_stat_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_stat_id')->constrained()->onDelete('cascade');
            $table->string('type'); // e.g., "commit_count", "problems_easy", "coding_minutes"
            $table->decimal('value', 15, 2); // Using decimal for flexibility with both int and float values
            $table->string('unit')->nullable(); // e.g., "minutes", "count", "steps"
            $table->json('meta')->nullable(); // e.g., language, repo, difficulty
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_stat_metrics');
    }
};
