<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leetcode_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('leetcode_id')->unique();
            $table->string('username')->index();
            $table->json('profile');
            $table->json('recent')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            $table->foreign('leetcode_id')->references('id')->on('leetcodes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leetcode_profiles');
    }
};
