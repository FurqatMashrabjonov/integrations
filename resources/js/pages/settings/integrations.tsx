import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Bell, Info, HelpCircle, ChevronRight } from 'lucide-react';

import FitbitDrawer from '@/components/integrations/FitbitDrawer';
import LeetcodeDrawer from '@/components/integrations/LeetcodeDrawer';
import WakapiDrawer from '@/components/integrations/WakapiDrawer';
import { type BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/settings/integrations' },
];

const integrationComponents = {
    fitbit: FitbitDrawer,
    leetcode: LeetcodeDrawer,
    wakapi: WakapiDrawer,
};

export default function Integrations() {
    const { integrationData } = usePage<SharedData>().props;
    const openIntegration = new URLSearchParams(window.location.search).get('open');

    const getStatusBadge = (provider: string) => {
        const isConnected = integrationData?.[provider]?.isIntegrated;
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
        <div className={`w-2 h-2 rounded-full mr-1 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
        }`} />
                {isConnected ? 'Ulangan' : 'Ulanmagan'}
      </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Integratsiyalar" />
            <SettingsLayout>
                <div className="space-y-6">
                    <div>
                        <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase">Integratsiyalar</h3>
                        <div className="mt-1 bg-light rounded-xl border divide-y shadow-sm overflow-hidden">
                            {Object.entries(integrationComponents).map(([provider, Component]) => (
                                <Component
                                    key={provider}
                                    isIntegrated={integrationData[provider]?.isIntegrated}
                                    autoOpen={openIntegration === provider}
                                    statusBadge={getStatusBadge(provider)}
                                    profile={integrationData[provider]?.profile}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase">Sozlamalar</h3>
                        <div className="mt-1 bg-info rounded-xl divide-y border shadow-sm overflow-hidden">
                            {[
                                { name: 'Xabarnoma', icon: Bell },
                                { name: 'Loyiha haqida', icon: Info },
                                { name: 'Yordam', icon: HelpCircle },
                            ].map(({ name, icon: Icon }, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className="w-full flex items-center space-x-4 px-4 py-3 hover:bg-muted/50 transition"
                                >
                                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
                                        <Icon className="text-muted-foreground h-5 w-5" />
                                    </div>
                                    <span className="flex-1 text-sm text-left">{name}</span>
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
