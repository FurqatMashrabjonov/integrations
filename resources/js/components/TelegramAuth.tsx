import { useEffect } from 'react';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { Loader2 } from 'lucide-react';

interface TelegramAuthProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function TelegramAuth({ onSuccess, onError }: TelegramAuthProps) {
    const { isLoading, user, isAuthenticated, error } = useTelegramAuth();

    useEffect(() => {
        if (isAuthenticated && onSuccess) {
            onSuccess();
        }
    }, [isAuthenticated, onSuccess]);

    useEffect(() => {
        if (error && onError) {
            onError(error);
        }
    }, [error, onError]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Telegram bilan kirish
                    </h3>
                    <p className="text-sm text-gray-600">
                        Telegram akkauntingiz orqali tizimga kirilmoqda...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.766 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Kirish amalga oshmadi
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {error}
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Qayta urinish
                    </button>
                </div>
            </div>
        );
    }

    if (isAuthenticated && user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Muvaffaqiyatli kirildi!
                    </h3>
                    <p className="text-sm text-gray-600">
                        Xush kelibsiz, {user.first_name}!
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Dashboard sahifasiga yo'naltirilmoqda...
                    </p>
                </div>
            </div>
        );
    }

    return null;
}
