import { Head } from '@inertiajs/react';
import { useState } from 'react';

import AuthLayout from '@/layouts/auth-layout';
import TelegramAuth from '@/components/TelegramAuth';
import { Button } from '@/components/ui/button';

interface TelegramLoginProps {
    status?: string;
}

export default function TelegramLogin({ status }: TelegramLoginProps) {
    const [authMode, setAuthMode] = useState<'telegram' | 'email'>('telegram');

    const handleTelegramSuccess = () => {
        console.log('Telegram authentication successful');
        // The hook will handle redirection
    };

    const handleTelegramError = (error: string) => {
        console.error('Telegram auth error:', error);
        // You could show a toast or other error handling here
    };

    if (authMode === 'telegram') {
        return (
            <AuthLayout 
                title="Telegram orqali kirish" 
                description="Telegram akkauntingiz orqali tez va oson kiring"
            >
                <Head title="Telegram Login" />

                <div className="space-y-6">
                    <TelegramAuth 
                        onSuccess={handleTelegramSuccess}
                        onError={handleTelegramError}
                    />

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                            Boshqa usul bilan kirmoqchimisiz?
                        </p>
                        <Button 
                            variant="outline" 
                            onClick={() => setAuthMode('email')}
                            className="w-full"
                        >
                            Email va parol bilan kirish
                        </Button>
                    </div>
                </div>

                {status && (
                    <div className="mb-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
            </AuthLayout>
        );
    }

    // Email login form (original login form)
    return (
        <AuthLayout 
            title="Email bilan kirish" 
            description="Email va parolingizni kiriting"
        >
            <Head title="Email Login" />
            
            <div className="space-y-6">
                <div className="text-center">
                    <Button 
                        variant="outline" 
                        onClick={() => setAuthMode('telegram')}
                        className="w-full mb-4"
                    >
                        ← Telegram orqali kirish
                    </Button>
                </div>

                {/* You can include the original email form here if needed */}
                <div className="text-center text-muted-foreground">
                    <p>Email va parol bilan kirish funksiyasi hali ishlab chiqilmoqda</p>
                </div>
            </div>
        </AuthLayout>
    );
}
