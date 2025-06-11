import { ExampleChart } from '@/components/example-chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { StepChart } from '@/components/step-chart';

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

    const {steps_of_today} = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Drawer>
                        <DrawerTrigger>
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center space-y-4">
                                        <div className="text-5xl font-bold text-foreground">{ String(steps_of_today) }</div>
                                        <p className="text-muted-foreground">Qadamlar soni</p>
                                    </div>
                                </div>
                            </div>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Qadamlar soni</DrawerTitle>
                                <DrawerDescription>Qadamlar bo'yicha statistika</DrawerDescription>
                            </DrawerHeader>

                            <StepChart/>

                        </DrawerContent>
                    </Drawer>

                </div>
            </div>
        </AppLayout>
    );
}
