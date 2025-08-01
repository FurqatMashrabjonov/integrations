import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@inertiajs/react';
import { ExternalLink, RefreshCw, Clock, Code } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WakapiProfile {
    display_name: string;
    full_name?: string;
    today_hours: number;
    today_seconds: number;
    week_hours: number;
    week_seconds: number;
    languages: Array<{name: string, total_seconds: number, percent: number}>;
    projects: Array<{name: string, total_seconds: number, percent: number}>;
    last_synced_at?: string;
    avatar?: string;
}

interface WakapiCardProps {
    isIntegrated?: boolean;
    showConnect?: boolean;
}

function getSystemThemeColor() {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? '#fff' : '#000';
    }
    return '#000';
}

export default function WakapiCard({
    isIntegrated,
    showConnect = true
}: WakapiCardProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [profile, setProfile] = useState<WakapiProfile | null>(null);
    const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            setLoading(true);
            const existsRes = await fetch(route('integrations.wakapi.exists'), {
                headers: { 'Accept': 'application/json' }
            });

            if (existsRes.ok) {
                const existsData = await existsRes.json();
                setIsConnected(existsData.exists);

                if (existsData.exists) {
                    await fetchProfileData();
                }
            }
        } catch (error) {
            console.error('Error checking Wakapi connection:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProfileData = async () => {
        try {
            const showRes = await fetch(route('integrations.wakapi.show'), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (showRes.ok) {
                const data = await showRes.json();
                setProfile(data);
                setLastSyncedAt(data.last_synced_at);
            } else if (showRes.status === 404) {
                // Profile not yet synced
                setProfile(null);
            }
        } catch (error) {
            console.error('Error fetching Wakapi profile:', error);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 60) {
            return `${diffInMinutes} daqiqa oldin`;
        } else if (diffInMinutes < 1440) { // less than 24 hours
            const hours = Math.floor(diffInMinutes / 60);
            const minutes = diffInMinutes % 60;
            return `${hours}:${minutes.toString().padStart(2, '0')}`;
        } else {
            return date.toLocaleDateString('uz-UZ', { 
                day: '2-digit', 
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const formatHours = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}s ${minutes}d`;
        }
        return `${minutes}d`;
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {showConnect && !isConnected && (
                <div className="absolute inset-0 backdrop-blur-[5px] rounded-3xl bg-black/5 z-10 flex flex-col items-center justify-center gap-4">
                    <span className="text-md font-bold text-foreground text-center">
                        Wakapi akkount ulanmagan.
                    </span>
                    <Link
                        href={route('integrations.edit', { open: 'wakapi' })}
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
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12 -5.373 12 -12S18.627 0 12 0zm0 2.824a9.176 9.176 0 1 1 0 18.352 9.176 9.176 0 0 1 0 -18.352zm5.097 5.058c-0.327 0 -0.61 0.19 -0.764 0.45 -1.025 1.463 -2.21 3.162 -3.288 4.706l-0.387 -0.636a0.897 0.897 0 0 0 -0.759 -0.439 0.901 0.901 0 0 0 -0.788 0.492l-0.357 0.581 -1.992 -2.943a0.897 0.897 0 0 0 -0.761 -0.446c-0.514 0 -0.903 0.452 -0.903 0.96a1 1 0 0 0 0.207 0.61l2.719 3.96c0.152 0.272 0.44 0.47 0.776 0.47a0.91 0.91 0 0 0 0.787 -0.483c0.046 -0.071 0.23 -0.368 0.314 -0.504l0.324 0.52c-0.035 -0.047 0.076 0.113 0.087 0.13 0.024 0.031 0.054 0.059 0.078 0.085 0.019 0.019 0.04 0.036 0.058 0.052 0.036 0.033 0.08 0.056 0.115 0.08 0.025 0.016 0.052 0.028 0.076 0.04 0.029 0.015 0.06 0.024 0.088 0.035 0.058 0.025 0.122 0.027 0.18 0.04 0.031 0.004 0.064 0.003 0.092 0.005 0.29 0 0.546 -0.149 0.707 -0.36 1.4 -2 2.842 -4.055 4.099 -5.849A0.995 0.995 0 0 0 18 8.842c0 -0.508 -0.389 -0.96 -0.903 -0.96"
                                          fill={getSystemThemeColor()} strokeWidth="1"></path>
                                </svg>
                            </div>
                        </div>
                        {isConnected && profile && (
                            <div className="flex items-center gap-3">
                                {profile.avatar && (
                                    <img
                                        src={profile.avatar}
                                        alt="Wakapi Profile"
                                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/32?text=W';
                                        }}
                                    />
                                )}
                                <div className="text-right min-w-0 flex-shrink">
                                    <p className="font-semibold text-foreground text-sm truncate">@{profile.display_name}</p>
                                    {lastSyncedAt && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <RefreshCw className="w-3 h-3" />
                                            {formatDate(lastSyncedAt)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <Skeleton className="h-6 w-8 mx-auto mb-1" />
                                    <Skeleton className="h-3 w-12 mx-auto" />
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <Skeleton className="h-6 w-8 mx-auto mb-1" />
                                    <Skeleton className="h-3 w-8 mx-auto" />
                                </div>
                            </div>
                        ) : isConnected && profile ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Clock className="w-4 h-4 text-orange-600" />
                                        <span className="text-lg font-bold text-orange-600">{formatHours(profile.today_seconds)}</span>
                                    </div>
                                    <p className="text-xs text-orange-600 font-medium">Bugungi vaqt</p>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Code className="w-4 h-4 text-blue-600" />
                                        <span className="text-lg font-bold text-blue-600">{profile.languages?.length || 0}</span>
                                    </div>
                                    <p className="text-xs text-blue-600 font-medium">Tillar</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3 opacity-50">
                                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                                        <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12 -5.373 12 -12S18.627 0 12 0zm0 2.824a9.176 9.176 0 1 1 0 18.352 9.176 9.176 0 0 1 0 -18.352zm5.097 5.058c-0.327 0 -0.61 0.19 -0.764 0.45 -1.025 1.463 -2.21 3.162 -3.288 4.706l-0.387 -0.636a0.897 0.897 0 0 0 -0.759 -0.439 0.901 0.901 0 0 0 -0.788 0.492l-0.357 0.581 -1.992 -2.943a0.897 0.897 0 0 0 -0.761 -0.446c-0.514 0 -0.903 0.452 -0.903 0.96a1 1 0 0 0 0.207 0.61l2.719 3.96c0.152 0.272 0.44 0.47 0.776 0.47a0.91 0.91 0 0 0 0.787 -0.483c0.046 -0.071 0.23 -0.368 0.314 -0.504l0.324 0.52c-0.035 -0.047 0.076 0.113 0.087 0.13 0.024 0.031 0.054 0.059 0.078 0.085 0.019 0.019 0.04 0.036 0.058 0.052 0.036 0.033 0.08 0.056 0.115 0.08 0.025 0.016 0.052 0.028 0.076 0.04 0.029 0.015 0.06 0.024 0.088 0.035 0.058 0.025 0.122 0.027 0.18 0.04 0.031 0.004 0.064 0.003 0.092 0.005 0.29 0 0.546 -0.149 0.707 -0.36 1.4 -2 2.842 -4.055 4.099 -5.849A0.995 0.995 0 0 0 18 8.842c0 -0.508 -0.389 -0.96 -0.903 -0.96"/>
                                    </svg>
                                </div>
                                <p className="text-sm">Akkaunt ulanmagan</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
