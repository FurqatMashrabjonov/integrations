import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@inertiajs/react';
import { ExternalLink, RefreshCw, Trophy, Calendar } from 'lucide-react';

interface LeetCodeProfile {
    username?: string;
    photo?: string;
}

interface LeetCodeStats {
    problems_solved_easy: number;
    problems_solved_medium: number;
    problems_solved_hard: number;
    problems_solved_today: number;
    ranking: number;
    last_updated: string | null;
}

interface LeetCodeCardProps {
    isIntegrated?: (integration: string) => boolean;
    showConnect?: boolean;
    dateFilter?: 'today' | 'weekly' | 'monthly';
    isConnected?: boolean;
    profile?: LeetCodeProfile | null;
    stats?: LeetCodeStats | null;
}

export default function LeetCodeCard({
    isIntegrated,
    showConnect = true,
    dateFilter = 'today',
    isConnected = false,
    profile = null,
    stats = null
}: LeetCodeCardProps) {

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

    const getTotalSolved = () => {
        if (!stats) return 0;
        return stats.problems_solved_easy + stats.problems_solved_medium + stats.problems_solved_hard;
    };

    const getDisplayStats = () => {
        if (!stats) return { easy: 0, medium: 0, hard: 0, ranking: 0, todaySubmissions: 0, period: 'Bugun' };

        return {
            easy: stats.problems_solved_easy,
            medium: stats.problems_solved_medium,
            hard: stats.problems_solved_hard,
            ranking: stats.ranking,
            todaySubmissions: stats.problems_solved_today,
            period: dateFilter === 'weekly' ? 'Bu hafta' : dateFilter === 'monthly' ? 'Bu oy' : 'Bugun'
        };
    };

    const displayStats = getDisplayStats();

    console.log(stats);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {showConnect && !isConnected && (
                <div className="absolute inset-0 backdrop-blur-[5px] rounded-3xl bg-black/5 z-10 flex flex-col items-center justify-center gap-4">
                    <span className="text-md font-bold text-foreground text-center">
                        LeetCode akkount ulanmagan.
                    </span>
                    <Link
                        href={route('integrations.edit', { open: 'leetcode' })}
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
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" id="leetcode">
                                    <path fill="currentColor" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"/>
                                    <path fill="currentColor" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"/>
                                    <path fill="currentColor" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"/>
                                </svg>
                            </div>
                        </div>
                        {isConnected && profile?.username && (
                            <div className="flex items-center gap-2 min-w-0">
                                {profile.photo && (
                                    <img
                                        src={profile.photo}
                                        alt={profile.username}
                                        className="w-6 h-6 rounded-full border-2 border-gray-200 flex-shrink-0"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/32?text=LC';
                                        }}
                                    />
                                )}
                                <div className="text-right min-w-0 flex-shrink">
                                    <p className="font-semibold text-foreground text-xs truncate">
                                        @{profile.username}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="pt-0">
                        {isConnected && stats ? (
                            <div className="space-y-2">
                                {/* Main Stats - 3 Neutral Cards */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center p-1.5 bg-muted rounded-xl">
                                        <div className="flex items-center justify-center gap-1 mb-0.5">
                                            <span className="text-base font-bold text-foreground">{displayStats.easy}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Easy</p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted rounded-xl">
                                        <div className="flex items-center justify-center gap-1 mb-0.5">
                                            <span className="text-base font-bold text-foreground">{displayStats.medium}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Medium</p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted rounded-xl">
                                        <div className="flex items-center justify-center gap-1 mb-0.5">
                                            <span className="text-base font-bold text-foreground">{displayStats.hard}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Hard</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-muted-foreground">
                                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" id="leetcode">
                                        <path fill="currentColor" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"/>
                                    </svg>
                                </div>
                                <p className="text-xs text-muted-foreground">Ma'lumot mavjud emas</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
