import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import WebApp from '@twa-dev/sdk';

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
}

interface UseTelegramAuthReturn {
    isLoading: boolean;
    user: TelegramUser | null;
    isAuthenticated: boolean;
    error: string | null;
}

export function useTelegramAuth(): UseTelegramAuthReturn {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initTelegramAuth = async () => {
            try {
                // Check if we're in Telegram Web App environment
                if (!WebApp.initData) {
                    throw new Error('Not running in Telegram Web App environment');
                }

                // Initialize the WebApp
                WebApp.ready();
                WebApp.expand();

                // Get user data from Telegram
                const telegramUser = WebApp.initDataUnsafe?.user;
                
                if (!telegramUser?.id) {
                    throw new Error('No Telegram user data available');
                }

                setUser(telegramUser);

                // Authenticate with backend
                await authenticateWithBackend(telegramUser);
                
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Telegram auth error:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed');
            } finally {
                setIsLoading(false);
            }
        };

        initTelegramAuth();
    }, []);

    const authenticateWithBackend = async (telegramUser: TelegramUser) => {
        try {
            const response = await fetch(route('telegram.auth'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    telegram_data: WebApp.initData,
                    user_data: telegramUser,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Backend authentication failed');
            }

            // Redirect to dashboard after successful authentication
            router.visit('/dashboard');
        } catch (err) {
            console.error('Backend auth error:', err);
            throw err;
        }
    };

    return {
        isLoading,
        user,
        isAuthenticated,
        error,
    };
}
