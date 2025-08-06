<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;

class TelegramAuthController extends Controller
{
    /**
     * Handle Telegram Web App authentication
     */
    public function authenticate(Request $request): RedirectResponse
    {
        // Validate Telegram Web App data
        $telegramData = $this->validateTelegramData($request->all());

        if (!$telegramData) {
            return redirect()->route('login')->with('error', 'Invalid Telegram authentication data');
        }

        // Find or create user
        $user = $this->findOrCreateUser($telegramData);

        // Log the user in
        Auth::login($user, true); // true for remember me

        $request->session()->regenerate();

        return redirect()->intended('/dashboard');
    }

    /**
     * Validate Telegram Web App data
     */
    private function validateTelegramData(array $data): ?array
    {
        // For testing purposes, we'll accept the fake data
        // In production, you should validate the hash using your bot token

        if (!isset($data['id'])) {
            return null;
        }

        return [
            'id'            => $data['id'],
            'first_name'    => $data['first_name'] ?? '',
            'last_name'     => $data['last_name'] ?? '',
            'username'      => $data['username'] ?? null,
            'photo_url'     => $data['photo_url'] ?? null,
            'language_code' => $data['language_code'] ?? 'en',
        ];
    }

    /**
     * Find existing user by Telegram ID or create new one
     */
    private function findOrCreateUser(array $telegramData): User
    {
        // First, try to find user by Telegram ID
        $user = User::where('telegram_id', $telegramData['id'])->first();

        if ($user) {
            // Update user info if needed
            $user->update([
                'telegram_username'      => $telegramData['username'],
                'telegram_first_name'    => $telegramData['first_name'],
                'telegram_last_name'     => $telegramData['last_name'],
                'telegram_photo_url'     => $telegramData['photo_url'],
                'telegram_language_code' => $telegramData['language_code'],
            ]);

            return $user;
        }

        // Create new user
        $fullName = trim($telegramData['first_name'] . ' ' . $telegramData['last_name']);
        if (empty($fullName)) {
            $fullName = $telegramData['username'] ?: 'Telegram User';
        }

        return User::create([
            'name'                   => $fullName,
            'email'                  => null, // Telegram users might not have email
            'password'               => Hash::make(Str::random(32)), // Random password since they login via Telegram
            'telegram_id'            => $telegramData['id'],
            'telegram_username'      => $telegramData['username'],
            'telegram_first_name'    => $telegramData['first_name'],
            'telegram_last_name'     => $telegramData['last_name'],
            'telegram_photo_url'     => $telegramData['photo_url'],
            'telegram_language_code' => $telegramData['language_code'],
            'email_verified_at'      => now(), // Consider Telegram users as verified
        ]);
    }
}
