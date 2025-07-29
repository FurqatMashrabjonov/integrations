import { Head, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Check, ChevronRight } from 'lucide-react';

// Import all integration Drawer components
import GithubDrawer from '@/components/integrations/GithubDrawer';
import FitbitDrawer from '@/components/integrations/FitbitDrawer';
import LeetcodeDrawer from '@/components/integrations/LeetcodeDrawer';
import WakapiDrawer from '@/components/integrations/WakapiDrawer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/integrations',
    },
];

export default function Integrations() {
    const { auth } = usePage<SharedData>().props;
    const integrations = auth.user.integrations || [];

    const getIntegrationIcon = (integration: string) => {
        return Array.isArray(integrations) && integrations.indexOf(integration) !== -1 ? (
            <Check className="text-muted-foreground h-4 w-4" />
        ) : (
            <ChevronRight className="text-muted-foreground h-4 w-4" />
        );
    };

    const isIntegrated = (integration: string) => {
        return Array.isArray(integrations) && integrations.indexOf(integration) !== -1;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Integrations" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Integration settings" />

                    <div className="bg-background text-foreground divide-y rounded-xl border shadow-sm p-6">
                        <GithubDrawer getIntegrationIcon={getIntegrationIcon} isIntegrated={isIntegrated} />
                        <FitbitDrawer getIntegrationIcon={getIntegrationIcon} isIntegrated={isIntegrated} />
                        <LeetcodeDrawer getIntegrationIcon={getIntegrationIcon} isIntegrated={isIntegrated} />
                        <WakapiDrawer getIntegrationIcon={getIntegrationIcon} isIntegrated={isIntegrated} />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
