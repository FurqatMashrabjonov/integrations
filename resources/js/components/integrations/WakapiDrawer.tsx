import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ChevronRight, Loader2, Clock, ExternalLink, Unlink, TimerIcon, Code } from 'lucide-react';
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

export default function WakapiDrawer({ isIntegrated, autoOpen = false, statusBadge, profile }: {
    isIntegrated: boolean,
    autoOpen?: boolean,
    statusBadge?: React.ReactNode,
    profile?: WakapiProfile | null
}) {
    const [open, setOpen] = useState(autoOpen);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm({ api_token: '' });

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        form.post(route('integrations.wakapi.store'), {
            onSuccess: () => {
                form.reset();
                toast("Wakapi muvaffaqiyatli ulandi", {
                    description: "Wakapi hisobingiz muvaffaqiyatli ulandi va ma'lumotlar sinxronlanmoqda",
                    position: 'top-right'
                });
                window.location.reload();
            },
            onError: (errors) => {
                const errorMessage = errors.api_token || 'Xatolik yuz berdi';
                setError(errorMessage);
                toast("Ulanish xatosi", {
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
                toast("Wakapi uzildi", {
                    description: "Wakapi akkaunt muvaffaqiyatli uzildi",
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
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-800 dark:to-blue-800">
                        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700 dark:text-gray-300">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12 -5.373 12 -12S18.627 0 12 0zm0 2.824a9.176 9.176 0 1 1 0 18.352 9.176 9.176 0 0 1 0 -18.352zm5.097 5.058c-0.327 0 -0.61 0.19 -0.764 0.45 -1.025 1.463 -2.21 3.162 -3.288 4.706l-0.387 -0.636a0.897 0.897 0 0 0 -0.759 -0.439 0.901 0.901 0 0 0 -0.788 0.492l-0.357 0.581 -1.992 -2.943a0.897 0.897 0 0 0 -0.761 -0.446c-0.514 0 -0.903 0.452 -0.903 0.96a1 1 0 0 0 0.207 0.61l2.719 3.96c0.152 0.272 0.44 0.47 0.776 0.47a0.91 0.91 0 0 0 0.787 -0.483c0.046 -0.071 0.23 -0.368 0.314 -0.504l0.324 0.52c-0.035 -0.047 0.076 0.113 0.087 0.13 0.024 0.031 0.054 0.059 0.078 0.085 0.019 0.019 0.04 0.036 0.058 0.052 0.036 0.033 0.08 0.056 0.115 0.08 0.025 0.016 0.052 0.028 0.076 0.04 0.029 0.015 0.06 0.024 0.088 0.035 0.058 0.025 0.122 0.027 0.18 0.04 0.031 0.004 0.064 0.003 0.092 0.005 0.29 0 0.546 -0.149 0.707 -0.36 1.4 -2 2.842 -4.055 4.099 -5.849A0.995 0.995 0 0 0 18 8.842c0 -0.508 -0.389 -0.96 -0.903 -0.96"
                                  fill="currentColor" strokeWidth="1"></path>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Wakapi</span>
                            {statusBadge || (isIntegrated ? <Check className="text-green-600 h-4 w-4" /> : null)}
                        </div>
                        <p className="text-xs text-muted-foreground">Kod yozish statistikasi</p>
                    </div>
                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                </div>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col h-[90vh]">
                <div className="sticky top-0 z-10 bg-background">
                    <DrawerHeader>
                        <DrawerTitle className="flex items-center gap-2">
                            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12 -5.373 12 -12S18.627 0 12 0zm0 2.824a9.176 9.176 0 1 1 0 18.352 9.176 9.176 0 0 1 0 -18.352zm5.097 5.058c-0.327 0 -0.61 0.19 -0.764 0.45 -1.025 1.463 -2.21 3.162 -3.288 4.706l-0.387 -0.636a0.897 0.897 0 0 0 -0.759 -0.439 0.901 0.901 0 0 0 -0.788 0.492l-0.357 0.581 -1.992 -2.943a0.897 0.897 0 0 0 -0.761 -0.446c-0.514 0 -0.903 0.452 -0.903 0.96a1 1 0 0 0 0.207 0.61l2.719 3.96c0.152 0.272 0.44 0.47 0.776 0.47a0.91 0.91 0 0 0 0.787 -0.483c0.046 -0.071 0.23 -0.368 0.314 -0.504l0.324 0.52c-0.035 -0.047 0.076 0.113 0.087 0.13 0.024 0.031 0.054 0.059 0.078 0.085 0.019 0.019 0.04 0.036 0.058 0.052 0.036 0.033 0.08 0.056 0.115 0.08 0.025 0.016 0.052 0.028 0.076 0.04 0.029 0.015 0.06 0.024 0.088 0.035 0.058 0.025 0.122 0.027 0.18 0.04 0.031 0.004 0.064 0.003 0.092 0.005 0.29 0 0.546 -0.149 0.707 -0.36 1.4 -2 2.842 -4.055 4.099 -5.849A0.995 0.995 0 0 0 18 8.842c0 -0.508 -0.389 -0.96 -0.903 -0.96"
                                      fill="currentColor" strokeWidth="1"></path>
                            </svg>
                            Wakapi Integration
                        </DrawerTitle>
                        <DrawerDescription>Wakapi hisobingizni ulash orqali kodlash statistikangizni ko'rishingiz mumkin.</DrawerDescription>
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
                                    <li>• Sizning kod yozish statistikangiz (soatlar, loyihalar, tillar) olinadi</li>
                                    <li>• Ma'lumotlar faqat ishlab chiqish faoliyati grafiklari uchun ishlatiladi</li>
                                    <li>• Kod matni yoki kod tarkibi saqlanmaydi</li>
                                    <li>• Ma'lumotlar kundalik yangilanadi</li>
                                    <li>• Istalgan vaqtda integratsiyani o'chirishingiz mumkin</li>
                                </ul>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => setAgreed(true)}>Roziman</Button>
                                <Button variant="outline" onClick={() => setOpen(false)}>Bekor qilish</Button>
                            </div>
                        </div>
                    ) : !isIntegrated && agreed ? (
                        <div className="space-y-4">
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                    <TimerIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold mb-1">Wakapi hisobingizni ulang</h3>
                                <p className="text-sm text-muted-foreground">API tokeningizni kiriting</p>
                            </div>

                            <form onSubmit={handleConnect} className="space-y-4">
                                <div>
                                    <Label htmlFor="api_token">API Token</Label>
                                    <Input
                                        id="api_token"
                                        type="password"
                                        value={form.data.api_token}
                                        onChange={(e) => form.setData('api_token', e.target.value)}
                                        required
                                    />
                                    {form.errors.api_token && (
                                        <p className="text-sm text-red-600 mt-1">{form.errors.api_token}</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Ulanmoqda...
                                        </>
                                    ) : (
                                        'Ulash'
                                    )}
                                </Button>
                            </form>

                            <div className="text-xs text-muted-foreground">
                                <p>API tokenni olish uchun:</p>
                                <p>1. <a href="https://wakapi.dev/settings" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wakapi Settings</a> sahifasiga o'ting</p>
                                <p>2. API Token bo'limidan tokenni nusxalang</p>
                            </div>
                        </div>
                    ) : profile ? (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                                <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            alt="LeetCode Avatar"
                                            className="w-16 h-16 rounded-full border-2 border-orange-200"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/64?text=LC';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center">
                                            <Code className="w-8 h-8 text-orange-700" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{profile.display_name}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Clock className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium">Wakapi ulandi</span>
                                    </div>
                                </div>
                                <a
                                    href="https://wakapi.dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                            {/* Disconnect Button */}
                            <div className="pt-4 ">
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
