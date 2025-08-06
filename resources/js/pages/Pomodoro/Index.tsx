import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, RotateCcw, Clock, CheckCircle, XCircle, Trees, Leaf, Settings } from 'lucide-react';
import axios from 'axios';

interface PomodoroSession {
    id: string;
    type: 'work' | 'short_break' | 'long_break';
    duration: number;
    task?: string;
    started_at: string;
    completed_at?: string;
    cancelled_at?: string;
    actual_duration?: number;
    is_active: boolean;
    completed?: boolean;
    cancelled?: boolean;
    elapsed_seconds?: number;
    remaining_seconds?: number;
}

interface Props {
    currentSession: PomodoroSession | null;
    sessions: PomodoroSession[];
}

export default function PomodoroIndex({ currentSession: initialSession, sessions: initialSessions }: Props) {
    const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(initialSession);
    const [sessions, setSessions] = useState<PomodoroSession[]>(initialSessions);
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    
    // Timer state
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    
    // Form state
    const [duration, setDuration] = useState('25');
    const [type, setType] = useState<'work' | 'short_break' | 'long_break'>('work');
    const [task, setTask] = useState('');

    const typeLabels = {
        work: 'Ish',
        short_break: 'Qisqa tanaffus',
        long_break: 'Uzun tanaffus'
    };

    const typeDurations = {
        work: 25,
        short_break: 5,
        long_break: 15
    };

    const typeColors = {
        work: 'from-green-400 to-emerald-600',
        short_break: 'from-blue-400 to-sky-600',
        long_break: 'from-purple-400 to-violet-600'
    };

    // Tree growing component
    const TreeGrowth = ({ progress }: { progress: number }) => {
        const treeHeight = Math.max(20, progress * 300); // Minimum 20px, max 300px
        const trunkHeight = treeHeight * 0.3;
        const canopySize = treeHeight * 0.7;
        const leafCount = Math.floor(progress * 20); // Up to 20 leaves
        
        return (
            <div className="relative flex items-end justify-center h-80 w-full">
                {/* Ground */}
                <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-amber-800 to-amber-700 rounded-lg"></div>
                
                {/* Grass */}
                <div className="absolute bottom-6 w-full h-4 flex justify-center">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-green-500 w-1 rounded-t-full opacity-70"
                            style={{
                                height: `${Math.random() * 20 + 10}px`,
                                marginLeft: `${i * 2}px`,
                                animation: `sway ${2 + Math.random() * 2}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Tree trunk */}
                <div
                    className="bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-lg transition-all duration-1000 ease-out"
                    style={{
                        width: `${Math.max(8, treeHeight * 0.15)}px`,
                        height: `${trunkHeight}px`,
                        marginBottom: '32px'
                    }}
                ></div>

                {/* Tree canopy */}
                <div
                    className="absolute bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{
                        width: `${canopySize}px`,
                        height: `${canopySize}px`,
                        bottom: `${trunkHeight + 20}px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.2)'
                    }}
                ></div>

                {/* Floating leaves */}
                {[...Array(leafCount)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-green-400 opacity-80"
                        style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${10 + Math.random() * 40}%`,
                            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`,
                            fontSize: `${8 + Math.random() * 8}px`
                        }}
                    >
                        🍃
                    </div>
                ))}

                {/* Birds (when tree is well grown) */}
                {progress > 0.7 && (
                    <>
                        <div
                            className="absolute text-lg"
                            style={{
                                left: '70%',
                                top: '20%',
                                animation: 'fly 8s ease-in-out infinite'
                            }}
                        >
                            🐦
                        </div>
                        <div
                            className="absolute text-sm"
                            style={{
                                left: '80%',
                                top: '30%',
                                animation: 'fly 6s ease-in-out infinite reverse',
                                animationDelay: '2s'
                            }}
                        >
                            🐦
                        </div>
                    </>
                )}

                {/* Completion celebration */}
                {progress >= 1 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl animate-bounce">🌳</div>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 opacity-20 rounded-full animate-pulse"></div>
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (currentSession?.is_active) {
            setIsRunning(true);
            setTimeRemaining(currentSession.remaining_seconds || 0);
        }
    }, [currentSession]);

    useEffect(() => {
        if (isRunning && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeRemaining]);

    const handleTimerComplete = async () => {
        try {
            const response = await axios.post('/pomodoro/stop');
            setCurrentSession(null);
            setSessions(prev => [response.data, ...prev]);
            
            // Show completion notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Pomodoro yakunlandi!', {
                    body: `${typeLabels[type]} sessiyasi muvaffaqiyatli yakunlandi.`,
                    icon: '/favicon.svg'
                });
            }
        } catch (error) {
            console.error('Error completing session:', error);
        }
    };

    const checkStatus = async () => {
        try {
            const response = await axios.get('/pomodoro/status');
            const status = response.data;
            
            if (status.active) {
                setCurrentSession(status);
                setTimeRemaining(status.remaining_seconds || 0);
                setIsRunning(true);
            } else {
                setCurrentSession(null);
                setIsRunning(false);
                setTimeRemaining(0);
                
                if (status.naturally_completed) {
                    // Refresh sessions list
                    const sessionsResponse = await axios.get('/pomodoro/history');
                    setSessions(sessionsResponse.data);
                }
            }
        } catch (error) {
            console.error('Error checking status:', error);
        }
    };

    // Check status every 5 seconds when there's an active session
    useEffect(() => {
        let statusInterval: NodeJS.Timeout;
        
        if (currentSession?.is_active) {
            statusInterval = setInterval(checkStatus, 5000);
        }
        
        return () => {
            if (statusInterval) {
                clearInterval(statusInterval);
            }
        };
    }, [currentSession?.is_active]);

    const startSession = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/pomodoro/start', {
                duration: parseInt(duration),
                type,
                task: task.trim() || null
            });
            
            setCurrentSession(response.data);
            setTimeRemaining(response.data.duration);
            setIsRunning(true);
            setTask('');
            
            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        } catch (error: any) {
            console.error('Error starting session:', error);
            alert(error.response?.data?.error || 'Xatolik yuz berdi');
        } finally {
            setIsLoading(false);
        }
    };

    const stopSession = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/pomodoro/stop');
            setCurrentSession(null);
            setIsRunning(false);
            setTimeRemaining(0);
            setSessions(prev => [response.data, ...prev]);
        } catch (error: any) {
            console.error('Error stopping session:', error);
            alert(error.response?.data?.error || 'Xatolik yuz berdi');
        } finally {
            setIsLoading(false);
        }
    };

    const cancelSession = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/pomodoro/cancel');
            setCurrentSession(null);
            setIsRunning(false);
            setTimeRemaining(0);
            setSessions(prev => [response.data, ...prev]);
        } catch (error: any) {
            console.error('Error canceling session:', error);
            alert(error.response?.data?.error || 'Xatolik yuz berdi');
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        return `${mins} daqiqa`;
    };

    const getProgressPercentage = () => {
        if (!currentSession) return 0;
        const elapsed = currentSession.duration - timeRemaining;
        return (elapsed / currentSession.duration) * 100;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Fokus Vaqti', href: '/pomodoro' }
            ]}
        >
            <Head title="Fokus Vaqti - Pomodoro">
                <style>{`
                    @keyframes sway {
                        0%, 100% { transform: translateX(0) rotate(0deg); }
                        50% { transform: translateX(2px) rotate(2deg); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-10px) rotate(180deg); }
                    }
                    @keyframes fly {
                        0% { transform: translateX(0px) translateY(0px); }
                        25% { transform: translateX(20px) translateY(-10px); }
                        50% { transform: translateX(40px) translateY(5px); }
                        75% { transform: translateX(20px) translateY(-5px); }
                        100% { transform: translateX(0px) translateY(0px); }
                    }
                `}</style>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-sky-100 via-green-50 to-emerald-100">
                {currentSession ? (
                    // Active Session View
                    <div className="h-screen flex flex-col">
                        {/* Top Status Bar */}
                        <div className="p-4 bg-white/80 backdrop-blur-sm shadow-sm">
                            <div className="flex items-center justify-between max-w-md mx-auto">
                                <Badge 
                                    variant="outline" 
                                    className={`bg-gradient-to-r ${typeColors[currentSession.type]} text-white border-none px-3 py-1`}
                                >
                                    {typeLabels[currentSession.type]}
                                </Badge>
                                <div className="text-sm text-gray-600">
                                    {currentSession.task || 'Fokusda qolish'}
                                </div>
                            </div>
                        </div>

                        {/* Main Timer and Tree Area */}
                        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                            {/* Timer Display */}
                            <div className="text-center mb-8">
                                <div className="text-7xl font-mono font-light text-gray-700 mb-2 tracking-wider">
                                    {formatTime(timeRemaining)}
                                </div>
                                <div className="text-sm text-gray-500 mb-4">
                                    Qolgan vaqt
                                </div>
                                <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto">
                                    <div 
                                        className={`h-2 rounded-full bg-gradient-to-r ${typeColors[currentSession.type]} transition-all duration-1000`}
                                        style={{ width: `${getProgressPercentage()}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Growing Tree */}
                            <div className="flex-1 w-full max-w-lg">
                                <TreeGrowth progress={getProgressPercentage() / 100} />
                            </div>

                            {/* Motivational Message */}
                            <div className="text-center mb-8">
                                <p className="text-lg text-gray-600 mb-2">
                                    {getProgressPercentage() < 25 ? '🌱 Daraxt o\'sishni boshladi' :
                                     getProgressPercentage() < 50 ? '🌿 Daraxt o\'sib bormoqda' :
                                     getProgressPercentage() < 75 ? '🌳 Daraxt kuchayib bormoqda' :
                                     getProgressPercentage() < 100 ? '🌲 Daraxt deyarli tayyor' :
                                     '🎉 Ajoyib! Daraxt to\'liq o\'sdi'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Fokusda qoling, daraxtingiz o'sib bormoqda!
                                </p>
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="p-6 bg-white/80 backdrop-blur-sm">
                            <div className="flex justify-center gap-4 max-w-md mx-auto">
                                <Button
                                    onClick={stopSession}
                                    disabled={isLoading}
                                    variant="outline"
                                    size="lg"
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white border-green-500"
                                >
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Tugatish
                                </Button>
                                <Button
                                    onClick={cancelSession}
                                    disabled={isLoading}
                                    variant="outline"
                                    size="lg"
                                    className="px-8 bg-red-500 hover:bg-red-600 text-white border-red-500"
                                >
                                    <XCircle className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Setup View
                    <div className="min-h-screen flex flex-col">
                        {/* Header */}
                        <div className="text-center py-8">
                            <h1 className="text-4xl font-light text-gray-700 mb-2">Fokus Vaqti</h1>
                            <p className="text-gray-500">Daraxt eking va fokusda qoling</p>
                        </div>

                        {/* Tree Preview */}
                        <div className="flex-1 max-w-lg mx-auto px-4">
                            <TreeGrowth progress={0.1} />
                        </div>

                        {/* Setup Card */}
                        <div className="p-6">
                            <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-xl border-0">
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {/* Session Type Selection */}
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700 mb-3 block">
                                                Sessiya turi
                                            </Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['work', 'short_break', 'long_break'] as const).map((sessionType) => (
                                                    <button
                                                        key={sessionType}
                                                        onClick={() => {
                                                            setType(sessionType);
                                                            setDuration(typeDurations[sessionType].toString());
                                                        }}
                                                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                                                            type === sessionType
                                                                ? `bg-gradient-to-r ${typeColors[sessionType]} text-white shadow-lg`
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        <div className="text-lg mb-1">
                                                            {sessionType === 'work' ? '💼' : 
                                                             sessionType === 'short_break' ? '☕' : '🛋️'}
                                                        </div>
                                                        <div className="text-xs">
                                                            {typeLabels[sessionType]}
                                                        </div>
                                                        <div className="text-xs opacity-75">
                                                            {typeDurations[sessionType]} min
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Duration Input */}
                                        <div>
                                            <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-2 block">
                                                Davomiyligi (daqiqa)
                                            </Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                min="1"
                                                max="60"
                                                value={duration}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
                                                className="text-center text-lg font-mono"
                                            />
                                        </div>

                                        {/* Task Input */}
                                        <div>
                                            <Label htmlFor="task" className="text-sm font-medium text-gray-700 mb-2 block">
                                                Vazifa (ixtiyoriy)
                                            </Label>
                                            <Input
                                                id="task"
                                                placeholder="Nimada ishlayapsiz?"
                                                value={task}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTask(e.target.value)}
                                                className="text-center"
                                            />
                                        </div>

                                        {/* Start Button */}
                                        <Button
                                            onClick={startSession}
                                            disabled={isLoading || !duration}
                                            size="lg"
                                            className={`w-full bg-gradient-to-r ${typeColors[type]} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                                        >
                                            <Play className="h-5 w-5 mr-2" />
                                            {isLoading ? 'Boshlanmoqda...' : 'Daraxt ekishni boshlash'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Forest History */}
                        {sessions.length > 0 && (
                            <div className="p-6">
                                <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Trees className="h-5 w-5" />
                                            Sizning o'rmoningiz
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-5 gap-2">
                                            {sessions.slice(0, 10).map((session) => (
                                                <div
                                                    key={session.id}
                                                    className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-lg"
                                                    title={`${typeLabels[session.type]} - ${new Date(session.started_at).toLocaleDateString()}`}
                                                >
                                                    {session.completed ? '🌳' : '🌱'}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-center mt-4">
                                            <p className="text-sm text-gray-600">
                                                Jami: {sessions.filter(s => s.completed).length} ta daraxt o'stirildi
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
