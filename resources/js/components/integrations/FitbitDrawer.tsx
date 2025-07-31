import { useState, useEffect } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight } from 'lucide-react';

export default function FitbitDrawer({ getIntegrationIcon, isIntegrated, autoOpen = false }: {
    getIntegrationIcon: (integration: string) => React.ReactNode,
    isIntegrated: (integration: string) => boolean,
    autoOpen?: boolean
}) {
    const [open, setOpen] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const integrated = isIntegrated('fitbit');

    const handleAgree = () => {
        setAgreed(true);
        window.location.href = route('integrations.fitbit.redirect');
    };

    useEffect(() => {
        if (autoOpen) {
            setOpen(true);
        }
    }, [autoOpen]);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div className="hover:bg-muted/50 flex cursor-pointer items-center space-x-4 px-4 py-3 transition">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="p-1" viewBox="0 0 24 24" id="fitbit">
                            <path
                                fill="#28B0B9"
                                d="M11.512 3.582c.976 0 1.786-.812 1.786-1.791 0-.975-.81-1.791-1.786-1.791-.971 0-1.784.815-1.784 1.791 0 .978.812 1.791 1.784 1.791zm.002 5.206a1.839 1.839 0 0 0 1.865-1.871 1.85 1.85 0 0 0-1.871-1.872c-1.05.002-1.859.814-1.859 1.872 0 1.057.81 1.871 1.865 1.871zm-5.028 6.658v.012a1.628 1.628 0 0 0 0 3.253c.893 0 1.619-.737 1.619-1.64a1.62 1.62 0 0 0-1.619-1.625zm-.023-5.112.012.001.011-.001h-.023zm5.045 4.881c-1.05.002-1.859.814-1.859 1.87 0 1.057.81 1.872 1.865 1.872 1.053 0 1.865-.814 1.865-1.872 0-.974-.823-1.868-1.871-1.87zm-5.033-4.88c-.967.006-1.692.734-1.692 1.708 0 .978.721 1.709 1.695 1.709s1.695-.732 1.695-1.709c0-.975-.729-1.702-1.698-1.708zM11.504 5.045h.008zM11.514 10.091h-.002c-1.052 0-1.945.894-1.945 1.951s.894 1.952 1.947 1.952 1.946-.894 1.946-1.952-.894-1.951-1.946-1.951zm-.002 10.332c-.972 0-1.784.812-1.784 1.79 0 .973.813 1.787 1.784 1.787a1.8 1.8 0 0 0 1.786-1.79 1.8 1.8 0 0 0-1.786-1.787zM11.504 15.215h.008z"
                            ></path>
                            <ellipse cx="16.46" cy="12.042" fill="#28B0B9" rx="2.189" ry="2.196"></ellipse>
                            <path
                                fill="#28B0B9"
                                d="M14.352 6.917c0 1.138.973 2.114 2.108 2.114s2.106-.978 2.106-2.114c0-1.139-.972-2.116-2.106-2.116v-.002c-1.136 0-2.108.98-2.108 2.118zm7.214 2.675V9.6a2.443 2.443 0 0 0-2.43 2.442c0 1.301 1.051 2.441 2.43 2.441 1.381 0 2.434-1.069 2.434-2.452-.082-1.386-1.135-2.439-2.434-2.439zm-5.106 9.609c1.135 0 2.106-.979 2.106-2.116s-.971-2.114-2.106-2.114c-1.136 0-2.108.979-2.108 2.114 0 1.139.973 2.116 2.108 2.116zM4.866 6.918c0 .894.729 1.625 1.62 1.625a1.625 1.625 0 0 0 0-3.251V5.29c-.892 0-1.62.732-1.62 1.628z"
                            ></path>
                            <ellipse cx="1.46" cy="12.042" fill="#28B0B9" rx="1.459" ry="1.464"></ellipse>
                        </svg>
                    </div>
                    <span className="flex-1 text-sm">Fitbitni ulash</span>
                    {integrated ? <Check className="text-muted-foreground h-4 w-4" /> : <ChevronRight className="text-muted-foreground h-4 w-4" />}
                </div>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col h-[90vh]">
                <div className="sticky top-0 z-10 bg-background">
                    <DrawerHeader>
                        <DrawerTitle>Fitbit Integration</DrawerTitle>
                        <DrawerDescription>Fitbit hisobingizni ulash orqali sog'liq ma'lumotlaringizni ko'rishingiz mumkin.</DrawerDescription>
                    </DrawerHeader>
                </div>
                <div className="overflow-y-auto px-4 py-2 flex-1">
                    {integrated ? (
                        <div className="text-green-600">Fitbit integratsiyasi ulangan.</div>
                    ) : !agreed ? (
                        <div>
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Fitbit Integratsiyasi haqida</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Fitbit hisobingizni ulash orqali siz o'zingizning qadamlar soni, faollik darajasi va boshqa sog'liq ko'rsatkichlarini ko'rishingiz mumkin.
                                </p>
                                <div className="mb-4 text-xs p-4 bg-muted rounded">
                                    <b>Maxfiylik va Foydalanish shartlari:</b>
                                    <ul className="mt-2 space-y-1">
                                        <li>• Sizning Fitbit faoliyat ma'lumotlaringiz (qadamlar, masofa, kaloriya) olinadi</li>
                                        <li>• Ma'lumotlar faqat sog'liq statistikalari va grafiklari uchun ishlatiladi</li>
                                        <li>• Hech qanday shaxsiy tibbiy ma'lumotlar saqlanmaydi</li>
                                        <li>• Ma'lumotlar 24 soat davomida yangilanadi</li>
                                        <li>• Istalgan vaqtda integratsiyani o'chirishingiz mumkin</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleAgree}>Roziman va ulash</Button>
                                <DrawerClose>
                                    <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" role="button" tabIndex={0}>Bekor qilish</span>
                                </DrawerClose>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-sm text-muted-foreground">Fitbit ga yo'naltirilmoqda...</p>
                        </div>
                    )}
                </div>
                <DrawerFooter className="bg-background sticky bottom-0 z-10">
                    <DrawerClose>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
