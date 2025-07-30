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
            <Head title="Integratsiyalar" />

            <SettingsLayout>
                <div className="space-y-6">
                    {/* Integrations Group */}
                    <div>
                        <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase">Integratsiyalar</h3>
                        <div className="mt-1 bg-light rounded-xl border divide-y shadow-sm overflow-hidden">
                            <GithubDrawer getIntegrationIcon={getIntegrationIcon} isIntegrated={isIntegrated} />
                            <FitbitDrawer getIntegrationIcon={getIntegrationIcon} isIntegrated={isIntegrated} />
                            <LeetcodeDrawer getIntegrationIcon={getIntegrationIcon} isIntegrated={isIntegrated} />
                            <WakapiDrawer getIntegrationIcon={getIntegrationIcon} isIntegrated={isIntegrated} />
                        </div>
                    </div>

                    {/* Other Settings Group */}
                    <div>
                        <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase">Preferences</h3>
                        <div className="mt-1 bg-info rounded-xl divide-y border shadow-sm overflow-hidden">
                            {['Notifications', 'Privacy', 'Language', 'About', 'Help'].map((item, idx) => (
                                <button
                                    type="button"
                                    key={idx}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted"
                                >
                                    <span className="text-foreground">{item}</span>
                                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
