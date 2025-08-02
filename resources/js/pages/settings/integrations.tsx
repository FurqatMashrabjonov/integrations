import { Head, usePage } from '@inertiajs/react';

import { type BreadcrumbItem, SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Bell, Shield, Languages, Info, HelpCircle, ChevronRight } from 'lucide-react';

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
    const { auth, integrationData } = usePage<SharedData>().props;
    const integrations = auth.user.integrations || [];

    // Debug: Log integration data to see what we're getting
    console.log('Integration Data:', integrationData);

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const openIntegration = urlParams.get('open');

    const isIntegrated = (integration: string) => {
        if (!Array.isArray(integrations)) return false;
        return integrations.some((int: any) => int.service === integration);
    };

    const getConnectionStatusBadge = (service: string) => {
        const serviceData = (integrationData as any)?.[service];
        const isConnected = serviceData?.isConnected || false;
        
        // Debug: Log the specific service data
        console.log(`${service} connection status:`, { serviceData, isConnected });
        
        return isConnected ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Ulangan
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                Ulanmagan
            </span>
        );
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
                            {/* GitHub Integration */}
                            <GithubDrawer 
                                isIntegrated={isIntegrated} 
                                autoOpen={openIntegration === 'github'}
                                statusBadge={getConnectionStatusBadge('github')}
                            />

                            {/* Fitbit Integration */}
                            <FitbitDrawer 
                                isIntegrated={isIntegrated} 
                                autoOpen={openIntegration === 'fitbit'}
                                statusBadge={getConnectionStatusBadge('fitbit')}
                            />

                            {/* LeetCode Integration */}
                            <LeetcodeDrawer 
                                isIntegrated={isIntegrated} 
                                autoOpen={openIntegration === 'leetcode'}
                                statusBadge={getConnectionStatusBadge('leetcode')}
                            />

                            {/* Wakapi Integration */}
                            <WakapiDrawer 
                                isIntegrated={isIntegrated} 
                                autoOpen={openIntegration === 'wakapi'}
                                statusBadge={getConnectionStatusBadge('wakapi')}
                            />
                        </div>
                    </div>

                    {/* Other Settings Group */}
                    <div>
                        <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase">Preferences</h3>
                        <div className="mt-1 bg-info rounded-xl divide-y border shadow-sm overflow-hidden">
                            {[
                                { name: 'Notifications', icon: Bell },
                                { name: 'Privacy', icon: Shield },
                                { name: 'Language', icon: Languages },
                                { name: 'About', icon: Info },
                                { name: 'Help', icon: HelpCircle }
                            ].map((item, idx) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        type="button"
                                        key={idx}
                                        className="w-full flex items-center space-x-4 px-4 py-3 hover:bg-muted/50 transition"
                                    >
                                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
                                            <IconComponent className="text-muted-foreground h-5 w-5" />
                                        </div>
                                        <span className="flex-1 text-sm text-left">{item.name}</span>
                                        <ChevronRight className="text-muted-foreground h-4 w-4" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
