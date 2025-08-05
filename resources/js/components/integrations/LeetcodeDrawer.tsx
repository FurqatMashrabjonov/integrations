import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ChevronRight, Loader2, Code, Flame, TrendingUp, ExternalLink, Unlink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from "sonner"

type LeetCodeProfile = {
    display_name: string;
    real_name?: string;
    total_solved: number;
    easy_solved: number;
    medium_solved: number;
    hard_solved: number;
    acceptance_rate: number;
    ranking?: number;
    contributions_count?: number;
    badges_count?: number;
    last_synced_at?: string;
    avatar?: string;
};

export default function LeetcodeDrawer({ isIntegrated, autoOpen = false, statusBadge, profile }: {
    isIntegrated: boolean,
    autoOpen?: boolean,
    statusBadge?: React.ReactNode,
    profile?: LeetCodeProfile | null
}) {
    const [open, setOpen] = useState(autoOpen);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm({ username: '' });

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        form.post(route('integrations.leetcode.store'), {
            onSuccess: () => {
                form.reset();
                toast("LeetCode muvaffaqiyatli ulandi", {
                    description: "LeetCode hisobingiz muvaffaqiyatli ulandi va ma'lumotlar sinxronlanmoqda",
                    position: 'top-right'
                });
                window.location.reload();
            },
            onError: (errors) => {
                const errorMessage = errors.username || 'Xatolik yuz berdi';
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

        router.delete(route('integrations.leetcode.destroy'), {
            onSuccess: () => {
                toast("LeetCode uzildi", {
                    description: "LeetCode akkaunt muvaffaqiyatli uzildi",
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

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'text-green-600 bg-green-50 border-green-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'hard': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div className="hover:bg-muted/50 flex cursor-pointer items-center space-x-4 px-4 py-3 transition" onClick={() => setOpen(true)}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-800 dark:to-yellow-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" id="leetcode">
                            <path fill="currentColor" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"/>
                            <path fill="currentColor" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"/>
                            <path fill="currentColor" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">LeetCode</span>
                            {statusBadge || (isIntegrated ? <Check className="text-green-600 h-4 w-4" /> : null)}
                        </div>
                        <p className="text-xs text-muted-foreground">Algoritmik masalalar statistikasi</p>
                    </div>
                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                </div>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col h-[90vh]">
                <div className="sticky top-0 z-10 bg-background">
                    <DrawerHeader>
                        <DrawerTitle className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" id="leetcode">
                                <path fill="currentColor" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"/>
                                <path fill="currentColor" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"/>
                                <path fill="currentColor" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"/>
                            </svg>
                            LeetCode Integration
                        </DrawerTitle>
                        <DrawerDescription>LeetCode hisobingizni ulash orqali masalalar yechish statistikangizni ko'ring</DrawerDescription>
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
                                    <li>• Sizning LeetCode profil ma'lumotlaringiz (hal qilingan masalalar, reytinglar) olinadi</li>
                                    <li>• Ma'lumotlar faqat yutuqlar va o'rganish taraqqiyoti uchun ishlatiladi</li>
                                    <li>• Hech qanday kod yoki echimlar saqlanmaydi</li>
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
                                    <Code className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold mb-1">LeetCode hisobingizni ulang</h3>
                                <p className="text-sm text-muted-foreground">LeetCode foydalanuvchi nomingizni kiriting</p>
                            </div>

                            <form onSubmit={handleConnect} className="space-y-4">
                                <div>
                                    <Label htmlFor="username">LeetCode Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="username"
                                        value={form.data.username}
                                        onChange={(e) => form.setData('username', e.target.value)}
                                        required
                                    />
                                    {form.errors.username && (
                                        <p className="text-sm text-red-600 mt-1">{form.errors.username}</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Tekshirilmoqda...
                                        </>
                                    ) : (
                                        'Ulash'
                                    )}
                                </Button>
                            </form>

                            <div className="text-xs text-muted-foreground">
                                <p>Foydalanuvchi nomingiz LeetCode profil sahifangizdan olinishi mumkin</p>
                                <p>Masalan: https://leetcode.com/u/<strong>username</strong>/</p>
                            </div>
                        </div>
                    ) : profile ? (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border">
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
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{profile.display_name}</h3>
                                    {profile.real_name && (
                                        <p className="text-sm text-muted-foreground">{profile.real_name}</p>
                                    )}
                                    <div className="flex items-center gap-1 mt-1">
                                        <Flame className="w-4 h-4 text-orange-600" />
                                        <span className="text-sm font-medium">LeetCode ulandi</span>
                                    </div>
                                </div>
                                <a
                                    href={`https://leetcode.com/u/${profile.display_name}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Additional Stats */}
                            {(profile.acceptance_rate || profile.ranking) && (
                                <div>
                                    <h4 className="font-semibold mb-3">Qo'shimcha ma'lumotlar</h4>
                                    <div className="space-y-2">
                                        {profile.acceptance_rate && (
                                            <div className="flex items-center justify-between p-2 bg-muted rounded">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Qabul darajasi</span>
                                                </div>
                                                <span className="text-sm font-bold">{profile.acceptance_rate.toFixed(1)}%</span>
                                            </div>
                                        )}
                                        {profile.ranking && (
                                            <div className="flex items-center justify-between p-2 bg-muted rounded">
                                                <div className="flex items-center gap-2">
                                                    <Flame className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Reyting</span>
                                                </div>
                                                <span className="text-sm font-bold">#{profile.ranking}</span>
                                            </div>
                                        )}
                                        {profile.badges_count && (
                                            <div className="flex items-center justify-between p-2 bg-muted rounded">
                                                <span className="text-sm font-medium">Badges</span>
                                                <span className="text-sm font-bold">{profile.badges_count}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Last Sync */}
                            {profile.last_synced_at && (
                                <div className="text-xs text-muted-foreground text-center p-2 bg-muted rounded">
                                    Oxirgi sinxronlash: {formatDate(profile.last_synced_at)}
                                </div>
                            )}

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
