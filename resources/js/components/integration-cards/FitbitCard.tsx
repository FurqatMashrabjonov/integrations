import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Link } from '@inertiajs/react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface FitbitProfile {
    username?: string;
    photo?: string;
    display_name?: string; // keeping legacy support
    avatar?: string; // keeping legacy support
}

interface FitbitStats {
    steps?: number;
    calories?: number;
    distance?: number;
    today_steps?: number;
    today_distance?: number;
    last_synced_at?: string;
}

interface FitbitCardProps {
    isIntegrated?: (integration: string) => boolean;
    showConnect?: boolean;
    isConnected?: boolean;
    profile?: FitbitProfile | null;
    stats?: FitbitStats | null;
}

export default function FitbitCard({
    isIntegrated,
    showConnect = true,
    isConnected = false,
    profile,
    stats
}: FitbitCardProps) {

    // Debug: Log the profile and stats data
    console.log('FitbitCard - isConnected:', isConnected);
    console.log('FitbitCard - profile:', profile);
    console.log('FitbitCard - stats:', stats);

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            return date.toLocaleString('uz-UZ', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return null;
        }
    };


    console.log(profile);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {showConnect && !isConnected && (
                <div className="absolute inset-0 backdrop-blur-[5px] rounded-3xl bg-black/5 z-10 flex flex-col items-center justify-center gap-4">
                    <span className="text-md font-bold text-foreground text-center">
                        Fitbit akkount ulanmagan.
                    </span>
                    <Link
                        href={route('integrations.edit', { open: 'fitbit' })}
                        className="px-5 py-2 rounded-lg font-semibold shadow transition bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <div className="flex items-center gap-1">
                            <span>Ulash</span>
                            <ExternalLink size={15} />
                        </div>
                    </Link>
                </div>
            )}
            <div className={showConnect && !isConnected ? "pointer-events-none select-none opacity-80 w-full" : "w-full"}>
                <Card className="rounded-3xl w-full shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2 text-base flex-shrink-0">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" id="fitbit">
                                    <path fill="currentColor" d="M11.512 3.582c.976 0 1.786-.812 1.786-1.791 0-.975-.81-1.791-1.786-1.791-.971 0-1.784.815-1.784 1.791 0 .978.812 1.791 1.784 1.791zm.002 5.206a1.839 1.839 0 0 0 1.865-1.871 1.85 1.85 0 0 0-1.871-1.872c-1.05.002-1.859.814-1.859 1.872 0 1.057.81 1.871 1.865 1.871zm-5.028 6.658v.012a1.628 1.628 0 0 0 0 3.253c.893 0 1.619-.737 1.619-1.64a1.62 1.62 0 0 0-1.619-1.625zm-.023-5.112.012.001.011-.001h-.023zm5.045 4.881c-1.05.002-1.859.814-1.859 1.87 0 1.057.81 1.872 1.865 1.872 1.053 0 1.865-.814 1.865-1.872 0-.974-.823-1.868-1.871-1.87zm-5.033-4.88c-.967.006-1.692.734-1.692 1.708 0 .978.721 1.709 1.695 1.709s1.695-.732 1.695-1.709c0-.975-.729-1.702-1.698-1.708zM11.504 5.045h.008zM11.514 10.091h-.002c-1.052 0-1.945.894-1.945 1.951s.894 1.952 1.947 1.952 1.946-.894 1.946-1.952-.894-1.951-1.946-1.951zm-.002 10.332c-.972 0-1.784.812-1.784 1.79 0 .973.813 1.787 1.784 1.787a1.8 1.8 0 0 0 1.786-1.79 1.8 1.8 0 0 0-1.786-1.787zM11.504 15.215h.008z"/>
                                    <ellipse cx="16.46" cy="12.042" fill="currentColor" rx="2.189" ry="2.196"></ellipse>
                                    <path fill="currentColor" d="M14.352 6.917c0 1.138.973 2.114 2.108 2.114s2.106-.978 2.106-2.114c0-1.139-.972-2.116-2.106-2.116v-.002c-1.136 0-2.108.98-2.108 2.118zm7.214 2.675V9.6a2.443 2.443 0 0 0-2.43 2.442c0 1.301 1.051 2.441 2.43 2.441 1.381 0 2.434-1.069 2.434-2.452-.082-1.386-1.135-2.439-2.434-2.439zm-5.106 9.609c1.135 0 2.106-.979 2.106-2.116s-.971-2.114-2.106-2.114c-1.136 0-2.108.979-2.108 2.114 0 1.139.973 2.116 2.108 2.116zM4.866 6.918c0 .894.729 1.625 1.62 1.625a1.625 1.625 0 0 0 0-3.251V5.29c-.892 0-1.62.732-1.62 1.628z"/>
                                    <ellipse cx="1.46" cy="12.042" fill="currentColor" rx="1.459" ry="1.464"></ellipse>
                                </svg>
                            </div>
                        </CardTitle>
                        {isConnected && profile && (profile.username || profile.display_name) && (
                            <div className="flex items-center gap-2 min-w-0">
                                {(profile.photo || profile.avatar) && (
                                    <img
                                        src={profile.photo || profile.avatar}
                                        alt="Fitbit Profile"
                                        className="w-6 h-6 rounded-full border-2 border-gray-200 flex-shrink-0"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/24?text=F';
                                        }}
                                    />
                                )}
                                <div className="text-right min-w-0 flex-shrink">
                                    <p className="font-semibold text-foreground text-xs truncate">
                                        @{profile.username || profile.display_name}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="pt-0">
                        {isConnected && (profile || stats) ? (
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center p-1.5 bg-muted rounded-lg min-w-0">
                                    <div className="flex flex-col items-center justify-center mb-0.5">
                                        <span className="text-sm mb-0.5">🦶</span>
                                        <span className="text-sm font-bold text-foreground leading-tight break-all">
                                            {stats?.steps?.toLocaleString() || '0'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Qadamlar</p>
                                </div>
                                <div className="text-center p-1.5 bg-muted rounded-lg min-w-0">
                                    <div className="flex flex-col items-center justify-center mb-0.5">
                                        <span className="text-sm mb-0.5">🔥</span>
                                        <span className="text-sm font-bold text-foreground leading-tight break-all">
                                            {stats?.calories || '0'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Kaloriya</p>
                                </div>
                                <div className="text-center p-1.5 bg-muted rounded-lg min-w-0">
                                    <div className="flex flex-col items-center justify-center mb-0.5">
                                        <span className="text-sm mb-0.5">🏃</span>
                                        <span className="text-sm font-bold text-foreground leading-tight break-all">
                                            {stats?.distance || stats?.today_distance || '0'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Km</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center p-1.5 bg-muted rounded-lg min-w-0">
                                    <div className="flex flex-col items-center justify-center mb-0.5">
                                        <span className="text-sm mb-0.5">👣</span>
                                        <span className="text-sm font-bold text-foreground leading-tight">0</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Qadamlar</p>
                                </div>
                                <div className="text-center p-1.5 bg-muted rounded-lg min-w-0">
                                    <div className="flex flex-col items-center justify-center mb-0.5">
                                        <span className="text-sm mb-0.5">🔥</span>
                                        <span className="text-sm font-bold text-foreground leading-tight">0</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Kaloriya</p>
                                </div>
                                <div className="text-center p-1.5 bg-muted rounded-lg min-w-0">
                                    <div className="flex flex-col items-center justify-center mb-0.5">
                                        <span className="text-sm mb-0.5">🏃</span>
                                        <span className="text-sm font-bold text-foreground leading-tight">0.0</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Km</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
