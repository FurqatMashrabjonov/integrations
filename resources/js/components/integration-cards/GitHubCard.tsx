import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@inertiajs/react';
import { ExternalLink, RefreshCw, GitBranch, GitCommit } from 'lucide-react';

interface GitHubProfile {
    display_name: string;
    last_synced_at?: string;
    avatar?: string;
    full_name?: string;
    connected_at?: string;
}

interface GitHubStats {
    total_commits: number;
    total_prs: number;
    total_repos: number;
    avg_commits: number;
    avg_prs: number;
    days_count: number;
    date_filter: string;
    last_updated?: string;
}

interface GitHubCardProps {
    isIntegrated?: boolean;
    showConnect?: boolean;
    isConnected?: boolean;
    profile?: GitHubProfile | null;
    stats?: GitHubStats | null;
    dateFilter?: 'today' | 'weekly' | 'monthly';
}

function getSystemThemeColor() {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? '#fff' : '#181717';
    }
    return '#181717'; // Default to dark color
}

export default function GitHubCard({
    isIntegrated,
    showConnect = true,
    isConnected = false,
    profile = null,
    stats = null,
    dateFilter = 'today'
}: GitHubCardProps) {

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

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {showConnect && !isConnected && (
                <div className="absolute inset-0 backdrop-blur-[5px] rounded-3xl bg-black/5 z-10 flex flex-col items-center justify-center gap-4">
                    <span className="text-md font-bold text-foreground text-center">
                        GitHub akkount ulanmagan.
                    </span>
                    <Link
                        href={route('integrations.github.redirect')}
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
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 128 128" id="github">
                                    <g fill={getSystemThemeColor()}>
                                        <path fillRule="evenodd" d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z" clipRule="evenodd"></path>
                                        <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm-.743-.55M28.93 94.535c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zm-.575-.618M31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm0 0M34.573 101.373c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm0 0M39.073 103.324c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm0 0M44.016 103.685c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm0 0M48.614 102.903c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        {isConnected && profile && (
                            <div className="flex items-center gap-3">
                                {profile.avatar && (
                                    <img
                                        src={profile.avatar}
                                        alt="GitHub Profile"
                                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/32?text=GH';
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
                        {isConnected && stats ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <GitBranch className="w-4 h-4 text-blue-600" />
                                        <span className="text-lg font-bold text-blue-600">{stats.total_prs}</span>
                                    </div>
                                    <p className="text-xs text-blue-600 font-medium">
                                        {dateFilter === 'today' ? 'Bugungi PRlar' : 
                                         dateFilter === 'weekly' ? 'Haftalik PRlar' : 'Oylik PRlar'}
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <GitCommit className="w-4 h-4 text-green-600" />
                                        <span className="text-lg font-bold text-green-600">{stats.total_commits}</span>
                                    </div>
                                    <p className="text-xs text-green-600 font-medium">
                                        {dateFilter === 'today' ? 'Bugungi commitlar' : 
                                         dateFilter === 'weekly' ? 'Haftalik commitlar' : 'Oylik commitlar'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3 opacity-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 128 128" id="github">
                                        <path fill="currentColor" d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"/>
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
