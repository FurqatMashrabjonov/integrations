import { ExampleChart } from '@/components/example-chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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
                        <ExampleChart />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center space-y-4">
                                <div className="text-5xl font-bold text-foreground">{ String(steps_of_today) }</div>
                                <p className="text-muted-foreground">Qadamlar soni</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                    {/* Background data & pattern */}
                    <ExampleChart />

                    {/* Blur Overlay */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md backdrop-brightness-90 rounded-xl bg-background/40">
                        <div className="flex flex-col items-center space-y-2 px-4 rounded-xl text-center">
                            <div className="text-lg font-semibold">
                                Integrate now
                            </div>
                            <p className="text-sm ">
                                Connect your integration to unlock full data.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
