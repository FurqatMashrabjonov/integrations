import { useState, useEffect, useCallback } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, ChevronRight, Loader2, User, GitBranch, GitCommit, ExternalLink, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from "sonner"

interface GitHubProfile {
    display_name: string;
    today_commits: number;
    today_prs: number;
    week_commits: number;
    week_prs: number;
    last_synced_at?: string;
    avatar?: string;
    full_name?: string;
}

function getSystemThemeColor() {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? '#fff' : '#181717';
    }
    return '#181717';
}

export default function GithubDrawer({ getIntegrationIcon, isIntegrated, autoOpen = false, statusBadge }: {
    getIntegrationIcon?: (integration: string) => React.ReactNode,
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
    const [profile, setProfile] = useState<GitHubProfile | null>(null);

    const fetchProfileData = useCallback(async () => {
        try {
            const showRes = await fetch(route('integrations.github.show'), {
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
            const existsRes = await fetch(route('integrations.github.exists'), {
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

    const handleConnect = () => {
        setLoading(true);
        toast("GitHub'ga yo'naltirilmoqda", {
            description: "GitHub hisobingizni ulash uchun tashqi sahifaga yo'naltirilmoqda...",
            position: 'top-right'
        });
        window.location.href = route('integrations.github.redirect');
    };

    const handleDisconnect = () => {
        setLoading(true);
        setError(null);

        router.delete(route('integrations.github.destroy'), {
            onSuccess: () => {
                setConnected(false);
                setProfile(null);
                toast("GitHub uzildi", {
                    description: "GitHub akkaunt muvaffaqiyatli uzildi",
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

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div className="hover:bg-muted/50 flex cursor-pointer items-center space-x-4 px-4 py-3 transition" onClick={handleOpenDrawer}>
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">GitHub</span>
                            {statusBadge || (connected ? <Check className="text-green-600 h-4 w-4" /> : null)}
                        </div>
                        <p className="text-xs text-muted-foreground">Repository va commit statistikalari</p>
                    </div>
                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                </div>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col h-[90vh]">
                <div className="sticky top-0 z-10 bg-background">
                    <DrawerHeader>
                        <DrawerTitle className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 128 128" id="github">
                                <g fill={getSystemThemeColor()}>
                                    <path fillRule="evenodd" d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"/>
                                </g>
                            </svg>
                            GitHub Integration
                        </DrawerTitle>
                        <DrawerDescription>GitHub repositoriyalaringiz va faoliyatingizni ko'ring</DrawerDescription>
                    </DrawerHeader>
                </div>

                <div className="overflow-y-auto px-4 py-2 flex-1">
                    {/* Error Alert */}
                    {error && (
                        <Alert className="mb-4 border-red-200 bg-red-50">
                            <AlertDescription className="text-red-800">{error}</AlertDescription>
                        </Alert>
                    )}

                    {!connected && !agreed ? (
                        <div>
                            <div className="mb-4 text-sm p-4 bg-muted rounded-lg">
                                <div className="font-semibold text-base mb-2">Maxfiylik va Foydalanish shartlari:</div>
                                <ul className="mt-2 space-y-1 text-sm">
                                    <li>• Sizning GitHub profilingiz va repositoriyalaringiz ma'lumotlari olinadi</li>
                                    <li>• Ma'lumotlar faqat statistika va profil ko'rsatish uchun ishlatiladi</li>
                                    <li>• Sizning kodingizga yoki private repositoriyalaringizga kirish yo'q</li>
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
                    ) : initialLoading ? (
                        <div className="space-y-6">
                            {/* Profile Header Skeleton */}
                            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                                <Skeleton className="w-16 h-16 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="w-4 h-4" />
                            </div>

                            {/* Statistics Skeleton */}
                            <div>
                                <Skeleton className="h-5 w-40 mb-3" />
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <Skeleton className="h-8 w-12 mx-auto mb-2" />
                                        <Skeleton className="h-3 w-12 mx-auto" />
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                        <Skeleton className="h-8 w-8 mx-auto mb-2" />
                                        <Skeleton className="h-3 w-8 mx-auto" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : !connected && agreed ? (
                        <div className="space-y-4">
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold mb-1">GitHub akkountingizni ulang</h3>
                                <p className="text-sm text-muted-foreground">GitHub hisobingizni ulash uchun tugmani bosing</p>
                            </div>

                            <Button onClick={handleConnect} disabled={loading} className="w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Yo'naltirilmoqda...
                                    </>
                                ) : (
                                    'GitHub ga ulash'
                                )}
                            </Button>
                        </div>
                    ) : profile ? (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt="GitHub Avatar"
                                        className="w-16 h-16 rounded-full border-2 border-gray-200"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/64?text=GH';
                                        }}
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="w-8 h-8 text-gray-700" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">@{profile.display_name}</h3>
                                    {profile.full_name && (
                                        <p className="text-sm text-muted-foreground">{profile.full_name}</p>
                                    )}
                                    <div className="flex items-center gap-1 mt-1">
                                        <GitBranch className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium">GitHub Connected</span>
                                    </div>
                                </div>
                                <a
                                    href={`https://github.com/${profile.display_name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Statistics */}
                            <div>
                                <h4 className="font-semibold mb-3">Bugungi faoliyat</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <GitBranch className="w-4 h-4 text-blue-600" />
                                            <div className="text-2xl font-bold text-blue-600">{profile.today_prs}</div>
                                        </div>
                                        <p className="text-xs text-blue-600 font-medium">Pull Requestlar</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <GitCommit className="w-4 h-4 text-green-600" />
                                            <div className="text-2xl font-bold text-green-600">{profile.today_commits}</div>
                                        </div>
                                        <p className="text-xs text-green-600 font-medium">Commitlar</p>
                                    </div>
                                </div>
                            </div>

                            {/* Weekly Summary */}
                            <div>
                                <h4 className="font-semibold mb-3">Haftalik umumiy ma'lumot</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <GitBranch className="w-4 h-4 text-purple-600" />
                                            <div className="text-xl font-bold text-purple-600">{profile.week_prs}</div>
                                        </div>
                                        <p className="text-xs text-purple-600 font-medium">Haftalik PRlar</p>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <GitCommit className="w-4 h-4 text-orange-600" />
                                            <div className="text-xl font-bold text-orange-600">{profile.week_commits}</div>
                                        </div>
                                        <p className="text-xs text-orange-600 font-medium">Haftalik Commitlar</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sync Info and Actions */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                {profile.last_synced_at && (
                                    <div className="text-xs text-muted-foreground">
                                        Oxirgi yangilanish: {formatDate(profile.last_synced_at)}
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchProfileData}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-1" />
                                            Yangilash
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Disconnect Button */}
                            <div className="pt-4 border-t">
                                <Button
                                    variant="destructive"
                                    onClick={handleDisconnect}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uzilmoqda...
                                        </>
                                    ) : (
                                        'Hisobni uzish'
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : connected ? (
                        <div className="space-y-6">
                            {/* Profile Header Skeleton */}
                            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                                <Skeleton className="w-16 h-16 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="w-4 h-4" />
                            </div>

                            <div className="text-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchProfileData}
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
