import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@inertiajs/react';
import { ExternalLink, RefreshCw, Clock, Code } from 'lucide-react';

interface WakapiProfile {
    username?: string;
    photo?: string;
}

interface WakapiStats {
    coding_time: number;
    languages_count: number;
    projects_count: number;
    last_updated: string | null;
}

interface WakapiCardProps {
    isIntegrated?: boolean;
    showConnect?: boolean;
    dateFilter?: 'today' | 'weekly' | 'monthly';
    isConnected?: boolean;
    profile?: WakapiProfile | null;
    stats?: WakapiStats | null;
}

function getSystemThemeColor() {
    return 'currentColor';
}

export default function WakapiCard({
    isIntegrated,
    showConnect = true,
    dateFilter = 'today',
    isConnected = false,
    profile = null,
    stats = null
}: WakapiCardProps) {

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

    const getDisplayStats = () => {
        if (!stats) return { codingTime: 0, languagesCount: 0, period: 'Bugun' };

        switch (dateFilter) {
            case 'weekly':
                return {
                    codingTime: stats.coding_time,
                    languagesCount: stats.languages_count,
                    period: 'Bu hafta'
                };
            case 'monthly':
                return {
                    codingTime: stats.coding_time,
                    languagesCount: stats.languages_count,
                    period: 'Bu oy'
                };
            default:
                return {
                    codingTime: stats.coding_time,
                    languagesCount: stats.languages_count,
                    period: 'Bugun'
                };
        }
    };

    const displayStats = getDisplayStats();

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
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700 dark:text-gray-300">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12 -5.373 12 -12S18.627 0 12 0zm0 2.824a9.176 9.176 0 1 1 0 18.352 9.176 9.176 0 0 1 0 -18.352zm5.097 5.058c-0.327 0 -0.61 0.19 -0.764 0.45 -1.025 1.463 -2.21 3.162 -3.288 4.706l-0.387 -0.636a0.897 0.897 0 0 0 -0.759 -0.439 0.901 0.901 0 0 0 -0.788 0.492l-0.357 0.581 -1.992 -2.943a0.897 0.897 0 0 0 -0.761 -0.446c-0.514 0 -0.903 0.452 -0.903 0.96a1 1 0 0 0 0.207 0.61l2.719 3.96c0.152 0.272 0.44 0.47 0.776 0.47a0.91 0.91 0 0 0 0.787 -0.483c0.046 -0.071 0.23 -0.368 0.314 -0.504l0.324 0.52c-0.035 -0.047 0.076 0.113 0.087 0.13 0.024 0.031 0.054 0.059 0.078 0.085 0.019 0.019 0.04 0.036 0.058 0.052 0.036 0.033 0.08 0.056 0.115 0.08 0.025 0.016 0.052 0.028 0.076 0.04 0.029 0.015 0.06 0.024 0.088 0.035 0.058 0.025 0.122 0.027 0.18 0.04 0.031 0.004 0.064 0.003 0.092 0.005 0.29 0 0.546 -0.149 0.707 -0.36 1.4 -2 2.842 -4.055 4.099 -5.849A0.995 0.995 0 0 0 18 8.842c0 -0.508 -0.389 -0.96 -0.903 -0.96"
                                          fill="currentColor" strokeWidth="1"></path>
                                </svg>
                            </div>
                        </div>
                        {isConnected && profile?.username && (
                            <div className="flex items-center gap-3 min-w-0">
                                {profile.photo && (
                                    <img
                                        src={profile.photo}
                                        alt={profile.username}
                                        className="w-8 h-8 rounded-full border-2 border-gray-200 flex-shrink-0"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/32?text=W';
                                        }}
                                    />
                                )}
                                <div className="text-right min-w-0 flex-shrink">
                                    <p className="font-semibold text-foreground text-sm truncate">
                                        @{profile.username}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isConnected && stats ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-lg font-bold text-foreground">{Math.floor(displayStats.codingTime / 3600)}h {Math.floor((displayStats.codingTime % 3600) / 60)}m</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">{displayStats.period} vaqt</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Code className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-lg font-bold text-foreground">{displayStats.languagesCount}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">Tillar</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3 opacity-50">
                                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                                        <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12 -5.373 12 -12S18.627 0 12 0zm0 2.824a9.176 9.176 0 1 1 0 18.352 9.176 9.176 0 0 1 0 -18.352zm5.097 5.058c-0.327 0 -0.61 0.19 -0.764 0.45 -1.025 1.463 -2.21 3.162 -3.288 4.706l-0.387 -0.636a0.897 0.897 0 0 0 -0.759 -0.439 0.901 0.901 0 0 0 -0.788 0.492l-0.357 0.581 -1.992 -2.943a0.897 0.897 0 0 0 -0.761 -0.446c-0.514 0 -0.903 0.452 -0.903 0.96a1 1 0 0 0 0.207 0.61l2.719 3.96c0.152 0.272 0.44 0.47 0.776 0.47a0.91 0.91 0 0 0 0.787 -0.483c0.046 -0.071 0.23 -0.368 0.314 -0.504l0.324 0.52c-0.035 -0.047 0.076 0.113 0.087 0.13 0.024 0.031 0.054 0.059 0.078 0.085 0.019 0.019 0.04 0.036 0.058 0.052 0.036 0.033 0.08 0.056 0.115 0.08 0.025 0.016 0.052 0.028 0.076 0.04 0.029 0.015 0.06 0.024 0.088 0.035 0.058 0.025 0.122 0.027 0.18 0.04 0.031 0.004 0.064 0.003 0.092 0.005 0.29 0 0.546 -0.149 0.707 -0.36 1.4 -2 2.842 -4.055 4.099 -5.849A0.995 0.995 0 0 0 18 8.842c0 -0.508 -0.389 -0.96 -0.903 -0.96"/>
                                    </svg>
                                </div>
                                <p className="text-sm text-muted-foreground">Ma'lumot mavjud emas</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
