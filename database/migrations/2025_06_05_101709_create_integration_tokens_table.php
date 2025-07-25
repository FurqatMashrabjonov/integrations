<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('integration_tokens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Foreign key to your users table
            $table->string('integration'); // e.g. 'fitbit', 'github', 'wakapi'
            $table->string('access_token');
            $table->string('refresh_token')->nullable(); // Some may not use refresh tokens
            $table->timestamp('expires_at')->nullable(); // Token expiry time if available
            $table->json('meta')->nullable(); // Store additional data (like scopes, token type)
            $table->string('serialized')->nullable(); // Serialized token data if needed
            $table->timestamps();

            $table->unique(['user_id', 'integration']); // Each user can only have one per integration
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integration_tokens');
    }
};
