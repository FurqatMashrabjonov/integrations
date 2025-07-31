import { useState, useEffect, useCallback } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ChevronRight, Loader2, User, Trophy, Calendar, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type LeetcodeProfile = {
    user_avatar: string;
    username: string;
    real_name: string;
    ranking: number;
    ac_submission_num_easy: number;
    ac_submission_num_medium: number;
    ac_submission_num_hard: number;
};

type RecentSubmission = {
    title: string;
    date: string;
    title_slug?: string;
    status_display?: string;
};

export default function LeetcodeDrawer({ isIntegrated, autoOpen = false }: {
    isIntegrated: (integration: string) => boolean,
    autoOpen?: boolean
}) {
    const [open, setOpen] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const form = useForm({ username: '' });
    const [profile, setProfile] = useState<LeetcodeProfile | null>(null);
    const [recent, setRecent] = useState<RecentSubmission[]>([]);
    const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

    const fetchProfileData = useCallback(async () => {
        try {
            const showRes = await fetch(route('integrations.leetcode.show'), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (showRes.ok) {
                const data = await showRes.json();
                setProfile(data.profile || null);
                setRecent(data.recent || []);
                setLastSyncedAt(data.last_synced_at);
            } else if (showRes.status === 404) {
                setError('Profil ma\'lumotlari hali sinxronlanmagan. Iltimos, biroz kuting...');
            } else {
                setError('Profil ma\'lumotlarini olishda xatolik yuz berdi');
            }
        } catch (err) {
            console.error('Fetch profile error:', err);
            setError('Profil ma\'lumotlarini olishda xatolik yuz berdi');
        }
    }, []);

    const checkConnectionStatus = useCallback(async () => {
        setInitialLoading(true);
        setError(null);

        try {
            const existsRes = await fetch(route('integrations.leetcode.exists'), {
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
                setError('Xizmatga ulanishda xatolik yuz berdi');
            }
        } catch (err) {
            console.error('Connection check error:', err);
            setError('Tarmoq xatosi');
        } finally {
            setInitialLoading(false);
        }
    }, [fetchProfileData]);

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.data.username.trim()) {
            setError('Username ni kiriting');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        form.post(route('integrations.leetcode.store'), {
            onSuccess: () => {
                setConnected(true);
                setSuccess('LeetCode akkaunt muvaffaqiyatli ulandi! Ma\'lumotlar sinxronlanmoqda...');
                // Wait a bit for the sync to complete, then fetch data
                setTimeout(() => {
                    fetchProfileData();
                }, 2000);
            },
            onError: (errors) => {
                setError(errors.username || 'Ulanishda xatolik yuz berdi');
            },
            onFinish: () => setLoading(false),
        });
    };

    const handleDisconnect = () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        router.delete(route('integrations.leetcode.destroy'), {
            onSuccess: () => {
                setConnected(false);
                setProfile(null);
                setRecent([]);
                setLastSyncedAt(null);
                form.setData('username', '');
                setSuccess('LeetCode akkaunt muvaffaqiyatli uzildi');
            },
            onError: () => setError('Uzishda xatolik yuz berdi'),
            onFinish: () => setLoading(false),
        });
    };

    const handleOpenDrawer = () => {
        setOpen(true);
        if (!initialLoading && agreed) {
            checkConnectionStatus();
        }
    };

    useEffect(() => {
        if (autoOpen) {
            setOpen(true);
            setAgreed(true);
            checkConnectionStatus();
        }
    }, [autoOpen, checkConnectionStatus]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('uz-UZ', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="p-1" viewBox="0 0 24 24" id="leetcode">
                            <path
                                fill="#B3B1B0"
                                d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"
                            ></path>
                            <path
                                fill="#E7A41F"
                                d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"
                            ></path>
                            <path
                                fill="#070706"
                                d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"
                            ></path>
                        </svg>
                    </div>
                    <span className="flex-1 text-sm">LeetCode</span>
                    {connected ? <Check className="text-green-600 h-4 w-4" /> : <ChevronRight className="text-muted-foreground h-4 w-4" />}
                </div>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col h-[90vh]">
                <div className="sticky top-0 z-10 bg-background">
                    <DrawerHeader>
                        <DrawerTitle className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" id="leetcode">
                                <path fill="#B3B1B0" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"/>
                                <path fill="#E7A41F" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"/>
                                <path fill="#070706" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"/>
                            </svg>
                            LeetCode Integration
                        </DrawerTitle>
                        <DrawerDescription>LeetCode profilingiz va faoliyatingizni ko'ring</DrawerDescription>
                    </DrawerHeader>
                </div>

                <div className="overflow-y-auto px-4 py-2 flex-1">
                    {/* Error Alert */}
                    {error && (
                        <Alert className="mb-4 border-red-200 bg-red-50">
                            <AlertDescription className="text-red-800">{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <Alert className="mb-4 border-green-200 bg-green-50">
                            <AlertDescription className="text-green-800">{success}</AlertDescription>
                        </Alert>
                    )}

                    {!agreed ? (
                        <div>
                            <div className="mb-4 text-sm p-4 bg-muted rounded-lg">
                                <div className="font-semibold text-base mb-2">Maxfiylik va Foydalanish shartlari:</div>
                                <ul className="mt-2 space-y-1 text-sm">
                                    <li>• Sizning LeetCode profilingiz va faoliyatingiz muntazam yangilanadi</li>
                                    <li>• Ma'lumotlaringiz faqat profilingizni ko'rsatish va statistikani hisoblash uchun ishlatiladi</li>
                                    <li>• Hech qanday parol yoki maxfiy ma'lumotlar saqlanmaydi</li>
                                    <li>• Istalgan vaqtda integratsiyani o'chirishingiz mumkin</li>
                                </ul>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => {
                                    setAgreed(true);
                                    checkConnectionStatus();
                                }}>Roziman</Button>
                                <DrawerClose asChild>
                                    <Button variant="outline">Bekor qilish</Button>
                                </DrawerClose>
                            </div>
                        </div>
                    ) : initialLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
                        </div>
                    ) : !connected ? (
                        <div className="space-y-4">
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold mb-1">LeetCode akkountingizni ulang</h3>
                                <p className="text-sm text-muted-foreground">Username kiriting va profilingizni sinxronlang</p>
                            </div>

                            <form onSubmit={handleConnect} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">LeetCode Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="masalan: john_doe"
                                        value={form.data.username}
                                        onChange={e => form.setData('username', e.target.value)}
                                        disabled={loading}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <Button type="submit" disabled={loading || !form.data.username.trim()} className="w-full">
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
                        </div>
                    ) : profile ? (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border">
                                <img
                                    src={profile.user_avatar}
                                    alt="LeetCode Avatar"
                                    className="w-16 h-16 rounded-full border-2 border-orange-200"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{profile.username}</h3>
                                    {profile.real_name && (
                                        <p className="text-sm text-muted-foreground">{profile.real_name}</p>
                                    )}
                                    <div className="flex items-center gap-1 mt-1">
                                        <Trophy className="w-4 h-4 text-yellow-600" />
                                        <span className="text-sm font-medium">Ranking: {profile.ranking?.toLocaleString() || 'N/A'}</span>
                                    </div>
                                </div>
                                <a
                                    href={`https://leetcode.com/${profile.username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Statistics */}
                            <div>
                                <h4 className="font-semibold mb-3">Yechilgan masalalar</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="text-2xl font-bold text-green-600">{profile.ac_submission_num_easy}</div>
                                        <p className="text-xs text-green-600 font-medium">Easy</p>
                                    </div>
                                    <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <div className="text-2xl font-bold text-yellow-600">{profile.ac_submission_num_medium}</div>
                                        <p className="text-xs text-yellow-600 font-medium">Medium</p>
                                    </div>
                                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                                        <div className="text-2xl font-bold text-red-600">{profile.ac_submission_num_hard}</div>
                                        <p className="text-xs text-red-600 font-medium">Hard</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Submissions */}
                            <div>
                                <h4 className="font-semibold mb-3">So'nggi yechimlar</h4>
                                {recent.length > 0 ? (
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {recent.map((submission, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{submission.title}</p>
                                                    {submission.status_display && (
                                                        <p className="text-xs text-green-600">{submission.status_display}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(submission.date)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg text-center">
                                        Hozircha yechimlar topilmadi
                                    </p>
                                )}
                            </div>

                            {/* Sync Info */}
                            {lastSyncedAt && (
                                <div className="text-xs text-muted-foreground text-center p-2 bg-muted rounded">
                                    Oxirgi yangilanish: {formatDate(lastSyncedAt)}
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
                                        'Hisobni uzish'
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : connected ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <p className="text-sm text-muted-foreground">Profil ma'lumotlari yuklanmoqda...</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchProfileData}
                                className="mt-4"
                            >
                                Qayta urinish
                            </Button>
                        </div>
                    ) : null}
                </div>

                <DrawerFooter className="bg-background sticky bottom-0 z-10">
                    <DrawerClose asChild>
                        <Button variant="outline">Yopish</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
