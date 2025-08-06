import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, Loader2, User, Activity, ExternalLink, Unlink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from "sonner"

type FitbitProfile = {
    display_name: string;
    last_synced_at?: string;
    avatar?: string;
    full_name?: string;
};

export default function FitbitDrawer({ isIntegrated, autoOpen = false, statusBadge, profile }: {
    isIntegrated: boolean,
    autoOpen?: boolean,
    statusBadge?: React.ReactNode,
    profile?: FitbitProfile | null
}) {
    const [open, setOpen] = useState(autoOpen);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnect = () => {
        setLoading(true);
        toast("Fitbit'ga yo'naltirilmoqda", {
            description: "Fitbit hisobingizni ulash uchun tashqi sahifaga yo'naltirilmoqda...",
            position: 'top-right'
        });
        window.location.href = route('integrations.fitbit.redirect');
    };

    const handleDisconnect = () => {
        setLoading(true);
        setError(null);

        router.delete(route('integrations.fitbit.destroy'), {
            onSuccess: () => {
                toast("Fitbit uzildi", {
                    description: "Fitbit akkaunt muvaffaqiyatli uzildi",
                    position: 'top-right'
                });
                window.location.reload();
            },
            onError: () => {
                const errorMessage = 'Uzishda xatolik yuz berdi';
                setError(errorMessage);
                toast("Uzishda xatolik", {
                    description: errorMessage,
                    position: 'top-right'
                });
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div className="hover:bg-muted/50 flex cursor-pointer items-center space-x-4 px-4 py-3 transition" onClick={() => setOpen(true)}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" id="fitbit">
                            <path fill="currentColor" d="M11.512 3.582c.976 0 1.786-.812 1.786-1.791 0-.975-.81-1.791-1.786-1.791-.971 0-1.784.815-1.784 1.791 0 .978.812 1.791 1.784 1.791zm.002 5.206a1.839 1.839 0 0 0 1.865-1.871 1.85 1.85 0 0 0-1.871-1.872c-1.05.002-1.859.814-1.859 1.872 0 1.057.81 1.871 1.865 1.871zm-5.028 6.658v.012a1.628 1.628 0 0 0 0 3.253c.893 0 1.619-.737 1.619-1.64a1.62 1.62 0 0 0-1.619-1.625zm-.023-5.112.012.001.011-.001h-.023zm5.045 4.881c-1.05.002-1.859.814-1.859 1.87 0 1.057.81 1.872 1.865 1.872 1.053 0 1.865-.814 1.865-1.872 0-.974-.823-1.868-1.871-1.87zm-5.033-4.88c-.967.006-1.692.734-1.692 1.708 0 .978.721 1.709 1.695 1.709s1.695-.732 1.695-1.709c0-.975-.729-1.702-1.698-1.708zM11.504 5.045h.008zM11.514 10.091h-.002c-1.052 0-1.945.894-1.945 1.951s.894 1.952 1.947 1.952 1.946-.894 1.946-1.952-.894-1.951-1.946-1.951zm-.002 10.332c-.972 0-1.784.812-1.784 1.79 0 .973.813 1.787 1.784 1.787a1.8 1.8 0 0 0 1.786-1.79 1.8 1.8 0 0 0-1.786-1.787zM11.504 15.215h.008z"/>
                            <ellipse cx="16.46" cy="12.042" fill="currentColor" rx="2.189" ry="2.196"></ellipse>
                            <path fill="currentColor" d="M14.352 6.917c0 1.138.973 2.114 2.108 2.114s2.106-.978 2.106-2.114c0-1.139-.972-2.116-2.106-2.116v-.002c-1.136 0-2.108.98-2.108 2.118zm7.214 2.675V9.6a2.443 2.443 0 0 0-2.43 2.442c0 1.301 1.051 2.441 2.43 2.441 1.381 0 2.434-1.069 2.434-2.452-.082-1.386-1.135-2.439-2.434-2.439zm-5.106 9.609c1.135 0 2.106-.979 2.106-2.116s-.971-2.114-2.106-2.114c-1.136 0-2.108.979-2.108 2.114 0 1.139.973 2.116 2.108 2.116zM4.866 6.918c0 .894.729 1.625 1.62 1.625a1.625 1.625 0 0 0 0-3.251V5.29c-.892 0-1.62.732-1.62 1.628z"/>
                            <ellipse cx="1.46" cy="12.042" fill="currentColor" rx="1.459" ry="1.464"></ellipse>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Fitbit</span>
                            {statusBadge || (isIntegrated ? <Check className="text-green-600 h-4 w-4" /> : null)}
                        </div>
                        <p className="text-xs text-muted-foreground">Qadamlar va faoliyat ma'lumotlari</p>
                    </div>
                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                </div>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col h-[90vh]">
                <div className="sticky top-0 z-10 bg-background">
                    <DrawerHeader>
                        <DrawerTitle className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" id="fitbit">
                                <path fill="#28B0B9" d="M11.512 3.582c.976 0 1.786-.812 1.786-1.791 0-.975-.81-1.791-1.786-1.791-.971 0-1.784.815-1.784 1.791 0 .978.812 1.791 1.784 1.791zm.002 5.206a1.839 1.839 0 0 0 1.865-1.871 1.85 1.85 0 0 0-1.871-1.872c-1.05.002-1.859.814-1.859 1.872 0 1.057.81 1.871 1.865 1.871zm-5.028 6.658v.012a1.628 1.628 0 0 0 0 3.253c.893 0 1.619-.737 1.619-1.64a1.62 1.62 0 0 0-1.619-1.625zm-.023-5.112.012.001.011-.001h-.023zm5.045 4.881c-1.05.002-1.859.814-1.859 1.87 0 1.057.81 1.872 1.865 1.872 1.053 0 1.865-.814 1.865-1.872 0-.974-.823-1.868-1.871-1.87zm-5.033-4.88c-.967.006-1.692.734-1.692 1.708 0 .978.721 1.709 1.695 1.709s1.695-.732 1.695-1.709c0-.975-.729-1.702-1.698-1.708zM11.504 5.045h.008zM11.514 10.091h-.002c-1.052 0-1.945.894-1.945 1.951s.894 1.952 1.947 1.952 1.946-.894 1.946-1.952-.894-1.951-1.946-1.951zm-.002 10.332c-.972 0-1.784.812-1.784 1.79 0 .973.813 1.787 1.784 1.787a1.8 1.8 0 0 0 1.786-1.79 1.8 1.8 0 0 0-1.786-1.787zM11.504 15.215h.008z"/>
                                <ellipse cx="16.46" cy="12.042" fill="#28B0B9" rx="2.189" ry="2.196"></ellipse>
                                <path fill="#28B0B9" d="M14.352 6.917c0 1.138.973 2.114 2.108 2.114s2.106-.978 2.106-2.114c0-1.139-.972-2.116-2.106-2.116v-.002c-1.136 0-2.108.98-2.108 2.118zm7.214 2.675V9.6a2.443 2.443 0 0 0-2.43 2.442c0 1.301 1.051 2.441 2.43 2.441 1.381 0 2.434-1.069 2.434-2.452-.082-1.386-1.135-2.439-2.434-2.439zm-5.106 9.609c1.135 0 2.106-.979 2.106-2.116s-.971-2.114-2.106-2.114c-1.136 0-2.108.979-2.108 2.114 0 1.139.973 2.116 2.108 2.116zM4.866 6.918c0 .894.729 1.625 1.62 1.625a1.625 1.625 0 0 0 0-3.251V5.29c-.892 0-1.62.732-1.62 1.628z"/>
                                <ellipse cx="1.46" cy="12.042" fill="#28B0B9" rx="1.459" ry="1.464"></ellipse>
                            </svg>
                            Fitbit Integration
                        </DrawerTitle>
                        <DrawerDescription>Fitbit profilingiz va faoliyatingizni ko'ring</DrawerDescription>
                    </DrawerHeader>
                </div>

                <div className="overflow-y-auto px-4 py-2 flex-1">
                    {/* Error Alert */}
                    {error && (
                        <Alert className="mb-4 border-red-200 bg-red-50">
                            <AlertDescription className="text-red-800">{error}</AlertDescription>
                        </Alert>
                    )}

                    {!isIntegrated && !agreed ? (
                        <div>
                            <div className="mb-4 text-sm p-4 bg-muted rounded-lg">
                                <div className="font-semibold text-base mb-2">Maxfiylik va Foydalanish shartlari:</div>
                                <ul className="mt-2 space-y-1 text-sm">
                                    <li>• Sizning Fitbit faoliyat ma'lumotlaringiz (qadamlar, masofa, kaloriya) olinadi</li>
                                    <li>• Ma'lumotlar faqat sog'liq statistikalari va grafiklari uchun ishlatiladi</li>
                                    <li>• Hech qanday shaxsiy tibbiy ma'lumotlar saqlanmaydi</li>
                                    <li>• Ma'lumotlar 24 soat davomida yangilanadi</li>
                                    <li>• Istalgan vaqtda integratsiyani o'chirishingiz mumkin</li>
                                </ul>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => {
                                    setAgreed(true);
                                }}>Roziman</Button>
                                <Button variant="outline" onClick={() => setOpen(false)}>Bekor qilish</Button>
                            </div>
                        </div>
                    ) : !isIntegrated && agreed ? (
                        <div className="space-y-4">
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold mb-1">Fitbit akkountingizni ulang</h3>
                                <p className="text-sm text-muted-foreground">Fitbit hisobingizni ulash uchun tugmani bosing</p>
                            </div>

                            <Button onClick={handleConnect} disabled={loading} className="w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Yo'naltirilmoqda...
                                    </>
                                ) : (
                                    'Fitbit ga ulash'
                                )}
                            </Button>
                        </div>
                    ) : profile ? (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border">
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt="Fitbit Avatar"
                                        className="w-16 h-16 rounded-full border-2 border-teal-200"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/64?text=FB';
                                        }}
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-teal-200 flex items-center justify-center">
                                        <User className="w-8 h-8 text-teal-700" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{profile.display_name}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Activity className="w-4 h-4 text-teal-600" />
                                        <span className="text-sm font-medium">Fitbit ulandi</span>
                                    </div>
                                </div>
                                <a
                                    href="https://www.fitbit.com/dashboard"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Disconnect Button */}
                            <div className="pt-4 border-t">
                                <Button
                                    variant="destructive"
                                    onClick={handleDisconnect}
                                    disabled={loading}
                                    className="w-full transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uzilmoqda...
                                        </>
                                    ) : (
                                        <>
                                            <Unlink className="mr-2 h-4 w-4" />
                                            Hisobni uzish
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : isIntegrated ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.location.reload()}
                                >
                                    Qayta urinish
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
