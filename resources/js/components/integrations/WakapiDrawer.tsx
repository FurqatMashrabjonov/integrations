import { useState, useEffect, useCallback } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, ChevronRight, Loader2, TimerIcon, Clock, Code, ExternalLink, RefreshCw, Unlink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from "sonner"

type WakapiProfile = {
    display_name: string;
    full_name?: string;
    today_hours: number;
    today_seconds: number;
    week_hours: number;
    week_seconds: number;
    languages: Array<{name: string, total_seconds: number, percent: number}>;
    projects: Array<{name: string, total_seconds: number, percent: number}>;
    last_synced_at?: string;
    avatar?: string;
};

export default function WakapiDrawer({ isIntegrated, autoOpen = false, statusBadge }: {
    isIntegrated: (integration: string) => boolean,
    autoOpen?: boolean,
    statusBadge?: React.ReactNode
}) {
    const [open, setOpen] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<WakapiProfile | null>(null);
    const form = useForm({ api_token: '' });

    const fetchProfileData = useCallback(async () => {
        try {
            const showRes = await fetch(route('integrations.wakapi.show'), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (showRes.ok) {
                const data = await showRes.json();
                setProfile(data);
            } else if (showRes.status === 404) {
                const errorMessage = 'Profil ma\'lumotlari hali sinxronlanmagan. Iltimos, biroz kuting...';
                setError(errorMessage);
                toast("Ma'lumotlar sinxronlanmoqda", {
                    description: errorMessage,
                    position: 'top-right'
                });
            } else {
                const errorMessage = 'Profil ma\'lumotlarini olishda xatolik yuz berdi';
                setError(errorMessage);
                toast("Ma'lumotlar olishda xatolik", {
                    description: errorMessage,
                    position: 'top-right'
                });
            }
        } catch (err) {
            console.error('Fetch profile error:', err);
            const errorMessage = 'Profil ma\'lumotlarini olishda xatolik yuz berdi';
            setError(errorMessage);
            toast("Ma'lumotlar olishda xatolik", {
                description: errorMessage,
                position: 'top-right'
            });
        }
    }, []);

    const checkConnectionStatus = useCallback(async () => {
        setInitialLoading(true);
        setError(null);

        try {
            const existsRes = await fetch(route('integrations.wakapi.exists'), {
                headers: { 'Accept': 'application/json' }
            });

            if (existsRes.ok) {
                const existsData = await existsRes.json();
                
                if (existsData.exists) {
                    setConnected(true);
                    await fetchProfileData();
                } else {
                    setConnected(false);
                }
            } else {
                const errorMessage = 'Xizmatga ulanishda xatolik yuz berdi';
                setError(errorMessage);
                toast("Ulanish xatosi", {
                    description: errorMessage,
                    position: 'top-right'
                });
            }
        } catch (err) {
            console.error('Connection check error:', err);
            const errorMessage = 'Tarmoq xatosi';
            setError(errorMessage);
            toast("Tarmoq xatosi", {
                description: errorMessage,
                position: 'top-right'
            });
        } finally {
            setInitialLoading(false);
        }
    }, [fetchProfileData]);

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        form.post(route('integrations.wakapi.store'), {
            onSuccess: () => {
                setConnected(true);
                form.reset();
                checkConnectionStatus();
                toast("Wakapi muvaffaqiyatli ulandi", {
                    description: "Wakapi hisobingiz muvaffaqiyatli ulandi va ma'lumotlar sinxronlanmoqda",
                    position: 'top-right'
                });
            },
            onError: (errors) => {
                const errorMessage = errors.api_token || 'Xatolik yuz berdi';
                setError(errorMessage);
                toast("Ulanishda xatolik", {
                    description: errorMessage,
                    position: 'top-right'
                });
            },
            onFinish: () => setLoading(false),
        });
    };

    const handleDisconnect = () => {
        setLoading(true);
        setError(null);

        router.delete(route('integrations.wakapi.destroy'), {
            onSuccess: () => {
                setConnected(false);
                setProfile(null);
                toast("Wakapi uzildi", {
                    description: "Wakapi akkaunt muvaffaqiyatli uzildi",
                    position: 'top-right'
                });
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

    const handleOpenDrawer = () => {
        setOpen(true);
        // Always check connection status when opening the drawer
        checkConnectionStatus();
    };

    useEffect(() => {
        if (autoOpen) {
            setOpen(true);
            checkConnectionStatus();
        }
    }, [autoOpen, checkConnectionStatus]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('uz-UZ', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const formatHours = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}s ${minutes}d`;
        }
        return `${minutes}d`;
    };

    const integrated = isIntegrated('wakapi');

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div className="hover:bg-muted/50 flex cursor-pointer items-center space-x-4 px-4 py-3 transition" onClick={handleOpenDrawer}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700 dark:text-gray-300">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12 -5.373 12 -12S18.627 0 12 0zm0 2.824a9.176 9.176 0 1 1 0 18.352 9.176 9.176 0 0 1 0 -18.352zm5.097 5.058c-0.327 0 -0.61 0.19 -0.764 0.45 -1.025 1.463 -2.21 3.162 -3.288 4.706l-0.387 -0.636a0.897 0.897 0 0 0 -0.759 -0.439 0.901 0.901 0 0 0 -0.788 0.492l-0.357 0.581 -1.992 -2.943a0.897 0.897 0 0 0 -0.761 -0.446c-0.514 0 -0.903 0.452 -0.903 0.96a1 1 0 0 0 0.207 0.61l2.719 3.96c0.152 0.272 0.44 0.47 0.776 0.47a0.91 0.91 0 0 0 0.787 -0.483c0.046 -0.071 0.23 -0.368 0.314 -0.504l0.324 0.52c-0.035 -0.047 0.076 0.113 0.087 0.13 0.024 0.031 0.054 0.059 0.078 0.085 0.019 0.019 0.04 0.036 0.058 0.052 0.036 0.033 0.08 0.056 0.115 0.08 0.025 0.016 0.052 0.028 0.076 0.04 0.029 0.015 0.06 0.024 0.088 0.035 0.058 0.025 0.122 0.027 0.18 0.04 0.031 0.004 0.064 0.003 0.092 0.005 0.29 0 0.546 -0.149 0.707 -0.36 1.4 -2 2.842 -4.055 4.099 -5.849A0.995 0.995 0 0 0 18 8.842c0 -0.508 -0.389 -0.96 -0.903 -0.96"
                                  fill="currentColor" strokeWidth="1"></path>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Wakapi</span>
                            {statusBadge || (connected ? <Check className="text-green-600 h-4 w-4" /> : null)}
                        </div>
                        <p className="text-xs text-muted-foreground">Kodlash vaqti va faoliyat</p>
                    </div>
                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                </div>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col h-[90vh]">
                <div className="sticky top-0 z-10 bg-background">
                    <DrawerHeader>
                        <DrawerTitle>Wakapi Integration</DrawerTitle>
                        <DrawerDescription>Wakapi hisobingizni ulash orqali kodlash statistikangizni ko'rishingiz mumkin.</DrawerDescription>
                    </DrawerHeader>
                </div>
                <div className="overflow-y-auto px-4 py-2 flex-1">
                    {initialLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-8 w-1/2" />
                        </div>
                    ) : error && !connected ? (
                        <Alert>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : connected && profile ? (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                    <TimerIcon className="text-primary h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{profile.display_name}</h3>
                                    {profile.full_name && <p className="text-muted-foreground text-sm">{profile.full_name}</p>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col space-y-2 pt-4 border-t">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={fetchProfileData}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    Ma'lumotlarni yangilash
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={handleDisconnect} 
                                    disabled={loading}
                                    className="w-full transition-all duration-200 hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Uzilmoqda...
                                        </>
                                    ) : (
                                        <>
                                            <Unlink className="h-4 w-4 mr-2" />
                                            Hisobni uzish
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : connected && !profile ? (
                        <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Ma'lumotlar yuklanmoqda...</p>
                        </div>
                    ) : !agreed ? (
                        <div>
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">Wakapi Integratsiyasi haqida</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Wakapi hisobingizni ulash orqali siz o'zingizning kodlash va faoliyat statistikangizni ko'rishingiz mumkin.
                                </p>
                                <div className="mb-4 text-xs p-4 bg-muted rounded-lg">
                                    <b>Maxfiylik va Foydalanish shartlari:</b>
                                    <ul className="mt-2 space-y-1">
                                        <li>• Sizning Wakapi faoliyatingiz (kodlash vaqti, tillar) olinadi</li>
                                        <li>• Ma'lumotlar faqat statistik ko'rsatkichlar uchun ishlatiladi</li>
                                        <li>• Istalgan vaqtda integratsiyani o'chirishingiz mumkin</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={() => setAgreed(true)} className="flex-1">
                                    Roziman va davom etish
                                </Button>
                                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                                    Bekor qilish
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">Wakapi API tokeni</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Wakapi hisobingizdan API tokenini oling va quyidagi maydonga kiriting:
                                </p>
                                <div className="text-xs text-muted-foreground mb-6 p-4 bg-muted rounded-lg">
                                    <b>API token qayerdan olish:</b>
                                    <ol className="mt-2 space-y-1 list-decimal list-inside">
                                        <li>Wakapi veb saytiga kiring</li>
                                        <li>Settings → API Key bo'limiga o'ting</li>
                                        <li>API tokeningizni nusxalang</li>
                                    </ol>
                                </div>
                            </div>
                            
                            {error && (
                                <Alert className="mb-4">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleConnect} className="space-y-4">
                                <div>
                                    <Label htmlFor="api_token">Wakapi API Token</Label>
                                    <Input
                                        id="api_token"
                                        type="password"
                                        value={form.data.api_token}
                                        onChange={e => form.setData('api_token', e.target.value)}
                                        disabled={loading}
                                        required
                                        placeholder="API tokeningizni kiriting..."
                                        className="mt-1"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button 
                                        type="submit" 
                                        disabled={loading || !form.data.api_token}
                                        className="flex-1"
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                                        Ulash
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setAgreed(false)}
                                        className="flex-1"
                                    >
                                        Orqaga
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
