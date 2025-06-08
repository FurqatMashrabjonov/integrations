import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Github, Activity, ChevronRight, Code, TimerIcon } from 'lucide-react';
import IntegrationsWelcome from '@/components/integrations-welcome';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/integrations',
    },
];

export default function Integrations() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Integrations" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Integration settings"
                        // description="Set your integrations: Github, Leetcode, Wakapi, Fitbit"
                    />

                    {/* iOS style section */}
                    <div className="rounded-xl border bg-background text-foreground shadow-sm divide-y">
                        {/* Github */}
                        <div
                            onClick={() =>
                                (window.location.href = route('integrations.github.redirect'))
                            }
                            className="flex items-center px-4 py-3 space-x-4 cursor-pointer hover:bg-muted/50 transition"
                        >
                            <div className="flex items-center justify-center bg-muted rounded-md w-10 h-10">
                                <Github className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <span className="flex-1 text-sm">Githubni ulash</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>

                        {/* Fitbit */}
                        <div
                            onClick={() =>
                                (window.location.href = route('integrations.fitbit.redirect'))
                            }
                            className="flex items-center px-4 py-3 space-x-4 cursor-pointer hover:bg-muted/50 transition"
                        >
                            <div className="flex items-center justify-center bg-muted rounded-md w-10 h-10">
                                <Activity className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <span className="flex-1 text-sm">Fitbitni ulash</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>

                        {/* Leetcode */}
                        <div
                            onClick={() =>
                                (window.location.href = route('/integrations/leetcode/redirect'))
                            }
                            className="flex items-center px-4 py-3 space-x-4 cursor-pointer hover:bg-muted/50 transition"
                        >
                            <div className="flex items-center justify-center bg-muted rounded-md w-10 h-10">
                                <Code className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <span className="flex-1 text-sm">Leetcodeni ulash</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>

                        {/* Wakapi */}
                        <div
                            onClick={() =>
                                (window.location.href = route('/integrations/wakapi/redirect'))
                            }
                            className="flex items-center px-4 py-3 space-x-4 cursor-pointer hover:bg-muted/50 transition"
                        >
                            <div className="flex items-center justify-center bg-muted rounded-md w-10 h-10">
                                <TimerIcon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <span className="flex-1 text-sm">Wakapini ulash</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>


                    <Drawer>
                        <DrawerTrigger>Open</DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                                <DrawerDescription>This action cannot be undone.</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                                <Button>Submit</Button>
                                <DrawerClose>
                                    <Button variant="outline">Cancel</Button>
                                    <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium
                                        aspernatur assumenda cumque deleniti distinctio dolore, doloremque eaque, illo
                                        iure magnam porro possimus quae quibusdam repellendus saepe sequi similique,
                                        veritatis vero?
                                    </div>
                                    <div>Accusamus cum eligendi fuga illo in iusto nam placeat quas tenetur voluptates.
                                        Asperiores cupiditate est neque reiciendis rem sed totam, voluptatibus? Deserunt
                                        explicabo fugiat magnam neque officia reprehenderit, similique ut?
                                    </div>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>

                    <IntegrationsWelcome />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
