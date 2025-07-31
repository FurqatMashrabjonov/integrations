import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface WakapiCardProps {
    username: string
    title: string
    avatarUrl?: string
    todayHours: string
    showConnect?: boolean
}

function getSystemThemeColor() {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? '#fff' : '#000';
    }
    return '#000';
}

export default function WakapiCard({ username, title, avatarUrl = "https://via.placeholder.com/48", todayHours, showConnect = true }: WakapiCardProps) {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {showConnect && (
                <div className="absolute inset-0 backdrop-blur-sm rounded-3xl bg-black/10 z-10 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">Wakapi ni ulang</span>
                </div>
            )}
            <div className={showConnect ? "blur-sm pointer-events-none select-none opacity-60 w-full" : "w-full"}>
                <Card className="rounded-3xl w-full shadow-sm">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted">
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="Wakatime--Streamline-Simple-Icons" height="24" width="24">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12 -5.373 12 -12S18.627 0 12 0zm0 2.824a9.176 9.176 0 1 1 0 18.352 9.176 9.176 0 0 1 0 -18.352zm5.097 5.058c-0.327 0 -0.61 0.19 -0.764 0.45 -1.025 1.463 -2.21 3.162 -3.288 4.706l-0.387 -0.636a0.897 0.897 0 0 0 -0.759 -0.439 0.901 0.901 0 0 0 -0.788 0.492l-0.357 0.581 -1.992 -2.943a0.897 0.897 0 0 0 -0.761 -0.446c-0.514 0 -0.903 0.452 -0.903 0.96a1 1 0 0 0 0.207 0.61l2.719 3.96c0.152 0.272 0.44 0.47 0.776 0.47a0.91 0.91 0 0 0 0.787 -0.483c0.046 -0.071 0.23 -0.368 0.314 -0.504l0.324 0.52c-0.035 -0.047 0.076 0.113 0.087 0.13 0.024 0.031 0.054 0.059 0.078 0.085 0.019 0.019 0.04 0.036 0.058 0.052 0.036 0.033 0.08 0.056 0.115 0.08 0.025 0.016 0.052 0.028 0.076 0.04 0.029 0.015 0.06 0.024 0.088 0.035 0.058 0.025 0.122 0.027 0.18 0.04 0.031 0.004 0.064 0.003 0.092 0.005 0.29 0 0.546 -0.149 0.707 -0.36 1.4 -2 2.842 -4.055 4.099 -5.849A0.995 0.995 0 0 0 18 8.842c0 -0.508 -0.389 -0.96 -0.903 -0.96"
                                          fill={getSystemThemeColor()} strokeWidth="1"></path>
                                </svg>
                            </div>
                        </CardTitle>
                        <div className="flex items-center gap-3">
                            <img src={avatarUrl} alt="Wakapi Profile" className="w-8 h-8 rounded-full border-2 border-gray-200" />
                            <p className="font-semibold text-foreground">@{username}</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-muted rounded-lg">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <span className="text-lg">📅</span>
                                    <span className="text-2xl font-bold text-foreground">{todayHours}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Aktiv soatlar</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
