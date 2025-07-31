import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, TimerIcon } from 'lucide-react';

export default function WakapiDrawer({ getIntegrationIcon, isIntegrated, autoOpen = false }: {
    getIntegrationIcon: (integration: string) => React.ReactNode,
    isIntegrated: (integration: string) => boolean,
    autoOpen?: boolean
}) {
    const [open, setOpen] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm({ api_key: '' });
    const integrated = isIntegrated('wakapi');

    const openDrawer = async () => {
        setOpen(true);
        setAgreed(false);
        setLoading(false);
        setError(null);
        // Check if Wakapi is connected (you'll need to implement this endpoint)
        try {
            const existsRes = await fetch(route('integrations.wakapi.exists'));
            const existsData = await existsRes.json();
            setConnected(existsData.exists);
        } catch {
            setConnected(false);
        }
    };

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        form.post(route('integrations.wakapi.store'), {
            onSuccess: () => {
                setConnected(true);
            },
            onError: (errors) => {
                setError(errors.api_key || 'Xatolik yuz berdi');
            },
            onFinish: () => setLoading(false),
        });
    };

    const handleDisconnect = () => {
        setLoading(true);
        setError(null);
        // Implement disconnect logic
        form.delete(route('integrations.wakapi.destroy'), {
            onSuccess: () => {
                setConnected(false);
            },
            onError: () => setError('Xatolik yuz berdi'),
            onFinish: () => setLoading(false),
        });
    };

    const handleAgree = () => {
        setAgreed(true);
        window.location.href = '/integrations/wakapi/redirect';
    };

    useEffect(() => {
        if (autoOpen) {
            setOpen(true);
            openDrawer();
        }
    }, [autoOpen]);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div className="hover:bg-muted/50 flex cursor-pointer items-center space-x-4 px-4 py-3 transition" onClick={openDrawer}>
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
                        <TimerIcon className="text-muted-foreground h-5 w-5" />
                    </div>
                    <span className="flex-1 text-sm">Wakapi</span>
                    {integrated ? <Check className="text-muted-foreground h-4 w-4" /> : <ChevronRight className="text-muted-foreground h-4 w-4" />}
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
                    {integrated ? (
                        <div className="text-green-600">Wakapi integratsiyasi ulangan.</div>
                    ) : !agreed ? (
                        <div>
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Wakapi Integratsiyasi haqida</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Wakapi hisobingizni ulash orqali siz o'zingizning kodlash va faoliyat statistikangizni ko'rishingiz mumkin.
                                </p>
                                <div className="mb-4 text-xs p-4 bg-muted rounded">
                                    <b>Maxfiylik va Foydalanish shartlari:</b>
                                    <ul className="mt-2 space-y-1">
                                        <li>• Sizning Wakapi faoliyatingiz (kodlash vaqti, tillar) olinadi</li>
                                        <li>• Ma'lumotlar faqat statistik ko'rsatkichlar uchun ishlatiladi</li>
                                        <li>• Istalgan vaqtda integratsiyani o'chirishingiz mumkin</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleAgree}>Roziman va ulash</Button>
                                <DrawerClose>
                                    <Button variant="outline">Bekor qilish</Button>
                                </DrawerClose>
                            </div>
                        </div>
                    ) : loading ? (
                        <div>Yuklanmoqda...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : !connected ? (
                        <div>
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Wakapi API kalitini kiriting</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Wakapi hisobingizdan API kalitini oling va quyidagi maydonga kiriting:
                                </p>
                                <div className="text-xs text-muted-foreground mb-4 p-3 bg-muted rounded">
                                    <b>API kalit qayerdan olish:</b>
                                    <ol className="mt-2 space-y-1 list-decimal list-inside">
                                        <li>Wakapi veb saytiga kiring</li>
                                        <li>Settings → API Key bo'limiga o'ting</li>
                                        <li>API kalitingizni nusxalang</li>
                                    </ol>
                                </div>
                            </div>
                            <form onSubmit={handleConnect} className="space-y-4">
                                <label className="block">
                                    <span className="text-sm">Wakapi API Key</span>
                                    <input
                                        type="password"
                                        className="input input-bordered w-full mt-1"
                                        value={form.data.api_key}
                                        onChange={e => form.setData('api_key', e.target.value)}
                                        disabled={loading}
                                        required
                                        placeholder="API kalitingizni kiriting..."
                                    />
                                </label>
                                <Button type="submit" disabled={loading || !form.data.api_key}>
                                    Ulash
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-4">Wakapi hisobingiz muvaffaqiyatli ulangan.</div>
                            <Button variant="destructive" onClick={handleDisconnect} disabled={loading}>
                                Hisobni uzish
                            </Button>
                        </div>
                    )}
                </div>
                <DrawerFooter className="bg-background sticky bottom-0 z-10">
                    <DrawerClose>
                        <Button variant="outline">Yopish</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
