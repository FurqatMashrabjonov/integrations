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
        Schema::table('users', function (Blueprint $table) {
            $table->string('telegram_id')->nullable()->unique()->after('id');
            $table->string('telegram_username')->nullable()->after('telegram_id');
            $table->string('telegram_first_name')->nullable()->after('telegram_username');
            $table->string('telegram_last_name')->nullable()->after('telegram_first_name');
            $table->string('telegram_photo_url')->nullable()->after('telegram_last_name');
            $table->string('telegram_language_code')->nullable()->after('telegram_photo_url');

            // Make email nullable since Telegram users might not have email
            $table->string('email')->nullable()->change();

            // Add index for Telegram ID for faster lookups
            $table->index('telegram_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['telegram_id']);
            $table->dropColumn([
                'telegram_id',
                'telegram_username',
                'telegram_first_name',
                'telegram_last_name',
                'telegram_photo_url',
                'telegram_language_code',
            ]);

            // Restore email as required
            $table->string('email')->nullable(false)->change();
        });
    }
};
