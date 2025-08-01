import { useEffect } from 'react';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import WebApp from '@twa-dev/sdk';

interface TelegramAutoAuthProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    skipAuth?: boolean; // Allow skipping auth for certain pages
}

/**
 * Component that automatically authenticates users via Telegram when the app loads
 * This should be used in the main app layout to provide seamless authentication
 */
export default function TelegramAutoAuth({ onSuccess, onError, skipAuth = false }: TelegramAutoAuthProps) {
    const { isLoading, user, isAuthenticated, error } = useTelegramAuth();

    useEffect(() => {
        if (skipAuth) return;
        
        // Only proceed if we're in a Telegram Web App environment
        if (!WebApp.initData) {
            console.log('Not in Telegram Web App environment, skipping auto-auth');
            return;
        }
        
        if (isAuthenticated && onSuccess) {
            onSuccess();
        }
    }, [isAuthenticated, onSuccess, skipAuth]);

    useEffect(() => {
        if (skipAuth) return;
        
        if (error && onError) {
            onError(error);
        }
    }, [error, onError, skipAuth]);

    // This component doesn't render anything - it just handles auth in the background
    return null;
}
