import { ExampleChart } from '@/components/example-chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Activity, ChevronRight, Code, Github, TimerIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    // useEchoPublic(
    //     `order`,
    //     "TestEvent",
    //     (e) => {
    //         console.log(e);
    //     },
    // );

    const { steps,  steps_of_today} = usePage<SharedData>().props;
    console.log('steps', steps);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex items-center justify-center pb-12 pt-2">
                            <div className="text-center space-y-4 flex flex-col items-center">
                                <img src="/assets/images/shoe.png" alt="Qadamlar soni" loading="lazy" width={60} className="text-sm"/>
                                <div className="text-4xl font-bold text-foreground">{ String(steps_of_today) }</div>
                                <p className="text-muted-foreground">Qadamlar</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex items-center justify-center pb-12 pt-2">
                            <div className="text-center space-y-4">
                                <Drawer>
                                    <DrawerTrigger>Qo'shish</DrawerTrigger>
                                    <DrawerContent>
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

                                    </DrawerContent>
                                </Drawer>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
