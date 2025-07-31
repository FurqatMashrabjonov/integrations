import { useState, useEffect } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

function getSystemThemeColor() {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? '#fff' : '#181717';
    }
    return '#181717';
}

export default function GithubDrawer({ getIntegrationIcon, isIntegrated, autoOpen = false }: {
    getIntegrationIcon: (integration: string) => React.ReactNode,
    isIntegrated: (integration: string) => boolean,
    autoOpen?: boolean
}) {
    const [open, setOpen] = useState(false);
    const [agreed, setAgreed] = useState(false);


    const handleAgree = () => {
        setAgreed(true);
        if (!isIntegrated('github')) {
            window.location.href = route('integrations.github.redirect');
        }
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="p-1" viewBox="0 0 128 128" id="github">
                            <g fill={getSystemThemeColor()}>
                                <path
                                    fillRule="evenodd"
                                    d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
                                    clipRule="evenodd"
                                ></path>
                                <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm-.743-.55M28.93 94.535c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zm-.575-.618M31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm0 0M34.573 101.373c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm0 0M39.073 103.324c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm0 0M44.016 103.685c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm0 0M48.614 102.903c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path>
                            </g>
                        </svg>
                    </div>
                    <span className="flex-1 text-sm">Githubni ulash</span>
                    {getIntegrationIcon('github')}
                </div>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col h-[90vh]">
                <div className="sticky top-0 z-10 bg-background">
                    <DrawerHeader>
                        <DrawerTitle>GitHub Integration</DrawerTitle>
                        <DrawerDescription>GitHub repositoriyalaringiz va faoliyatingizni ko'ring</DrawerDescription>
                    </DrawerHeader>
                </div>
                <div className="overflow-y-auto px-4 py-2 flex-1">
                    {!agreed ? (
                        <div>
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">GitHub Integratsiyasi haqida</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    GitHub hisobingizni ulash orqali siz o'zingizning repositoriyalaringiz, commitlaringiz va faoliyatingizni ko'rishingiz mumkin.
                                </p>
                                <div className="mb-4 text-xs p-4 bg-muted rounded">
                                    <b>Maxfiylik va Foydalanish shartlari:</b>
                                    <ul className="mt-2 space-y-1">
                                        <li>• Sizning GitHub profilingiz va repositoriyalaringiz ma'lumotlari olinadi</li>
                                        <li>• Ma'lumotlar faqat statistika va profil ko'rsatish uchun ishlatiladi</li>
                                        <li>• Sizning kodingizga yoki private repositoriyalaringizga kirish yo'q</li>
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
                            <p className="mt-4 text-sm text-muted-foreground">GitHub ga yo'naltirilmoqda...</p>
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
