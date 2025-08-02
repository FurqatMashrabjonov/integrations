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
    display_name: string;
    today_steps: number;
    today_distance: number;
    week_steps: number;
    last_synced_at?: string;
    avatar?: string;
}

interface FitbitCardProps {
    isIntegrated?: (integration: string) => boolean;
    showConnect?: boolean;
    isConnected?: boolean;
    profile?: FitbitProfile | null;
}

export default function FitbitCard({
    isIntegrated,
    showConnect = true,
    isConnected = false,
    profile = null
}: FitbitCardProps) {

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
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-lg flex-shrink-0">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" id="fitbit">
                                    <path fill="#28B0B9" d="M11.512 3.582c.976 0 1.786-.812 1.786-1.791 0-.975-.81-1.791-1.786-1.791-.971 0-1.784.815-1.784 1.791 0 .978.812 1.791 1.784 1.791zm.002 5.206a1.839 1.839 0 0 0 1.865-1.871 1.85 1.85 0 0 0-1.871-1.872c-1.05.002-1.859.814-1.859 1.872 0 1.057.81 1.871 1.865 1.871zm-5.028 6.658v.012a1.628 1.628 0 0 0 0 3.253c.893 0 1.619-.737 1.619-1.64a1.62 1.62 0 0 0-1.619-1.625zm-.023-5.112.012.001.011-.001h-.023zm5.045 4.881c-1.05.002-1.859.814-1.859 1.87 0 1.057.81 1.872 1.865 1.872 1.053 0 1.865-.814 1.865-1.872 0-.974-.823-1.868-1.871-1.87zm-5.033-4.88c-.967.006-1.692.734-1.692 1.708 0 .978.721 1.709 1.695 1.709s1.695-.732 1.695-1.709c0-.975-.729-1.702-1.698-1.708zM11.504 5.045h.008zM11.514 10.091h-.002c-1.052 0-1.945.894-1.945 1.951s.894 1.952 1.947 1.952 1.946-.894 1.946-1.952-.894-1.951-1.946-1.951zm-.002 10.332c-.972 0-1.784.812-1.784 1.79 0 .973.813 1.787 1.784 1.787a1.8 1.8 0 0 0 1.786-1.79 1.8 1.8 0 0 0-1.786-1.787zM11.504 15.215h.008z"/>
                                    <ellipse cx="16.46" cy="12.042" fill="#28B0B9" rx="2.189" ry="2.196"></ellipse>
                                    <path fill="#28B0B9" d="M14.352 6.917c0 1.138.973 2.114 2.108 2.114s2.106-.978 2.106-2.114c0-1.139-.972-2.116-2.106-2.116v-.002c-1.136 0-2.108.98-2.108 2.118zm7.214 2.675V9.6a2.443 2.443 0 0 0-2.43 2.442c0 1.301 1.051 2.441 2.43 2.441 1.381 0 2.434-1.069 2.434-2.452-.082-1.386-1.135-2.439-2.434-2.439zm-5.106 9.609c1.135 0 2.106-.979 2.106-2.116s-.971-2.114-2.106-2.114c-1.136 0-2.108.979-2.108 2.114 0 1.139.973 2.116 2.108 2.116zM4.866 6.918c0 .894.729 1.625 1.62 1.625a1.625 1.625 0 0 0 0-3.251V5.29c-.892 0-1.62.732-1.62 1.628z"/>
                                    <ellipse cx="1.46" cy="12.042" fill="#28B0B9" rx="1.459" ry="1.464"></ellipse>
                                </svg>
                            </div>
                        </CardTitle>
                        {isConnected && profile && (
                            <div className="flex items-center gap-3 min-w-0">
                                {profile.avatar && (
                                    <img
                                        src={profile.avatar}
                                        alt="Fitbit Profile"
                                        className="w-8 h-8 rounded-full border-2 border-gray-200 flex-shrink-0"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/32?text=F';
                                        }}
                                    />
                                )}
                                <div className="text-right min-w-0 flex-shrink">
                                    <p className="font-semibold text-foreground text-sm truncate">@{profile.display_name}</p>
                                    {profile.last_synced_at && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <RefreshCw className="w-3 h-3" />
                                            {formatDate(profile.last_synced_at)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isConnected && profile ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-lg">👣</span>
                                        <span className="text-2xl font-bold text-foreground">{profile.today_steps.toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Qadamlar</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-lg">🏃</span>
                                        <span className="text-2xl font-bold text-foreground">{profile.today_distance}</span>
                                        <span className="text-lg font-light text-foreground">km</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Masofa</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-lg">👣</span>
                                        <span className="text-2xl font-bold text-foreground">0</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Qadamlar</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-lg">🏃</span>
                                        <span className="text-2xl font-bold text-foreground">0.0</span>
                                        <span className="text-lg font-light text-foreground">km</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Masofa</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
