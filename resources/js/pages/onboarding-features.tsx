import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Star, TrendingUp, Shield, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLogoIcon from '@/components/app-logo-icon';

export default function OnboardingFeatures() {
    const [currentStep, setCurrentStep] = useState(0);

    const features = [
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Real-time Analytics",
            description: "Track your progress with live data updates from all your connected services."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure Connections",
            description: "Your data is protected with enterprise-grade security and encryption."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Lightning Fast",
            description: "Optimized performance ensures your dashboard loads instantly every time."
        },
        {
            icon: <Star className="w-6 h-6" />,
            title: "Smart Insights",
            description: "Get intelligent recommendations based on your activity patterns."
        }
    ];

    const integrations = [
        {
            name: "Fitbit",
            description: "Steps, sleep, heart rate, and workout tracking",
            logo: "💪",
            color: "bg-green-500",
            features: ["Daily steps", "Sleep quality", "Heart rate zones", "Workout summaries"]
        },
        {
            name: "WakaTime",
            description: "Coding time, languages, and project analytics", 
            logo: "⏱️",
            color: "bg-blue-500",
            features: ["Daily coding time", "Language stats", "Project breakdown", "Weekly reports"]
        },
        {
            name: "LeetCode",
            description: "Problem solving progress and skill tracking",
            logo: "🧩", 
            color: "bg-purple-500",
            features: ["Problems solved", "Difficulty tracking", "Streak counter", "Performance trends"]
        }
    ];

    const steps = [
        {
            id: 1,
            title: "Welcome to Integration Hub",
            subtitle: "Your Personal Productivity Command Center",
            content: (
                <div className="space-y-6">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
                                    <AppLogoIcon className="w-10 h-10 text-white" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <Star className="w-3 h-3 text-yellow-800" />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-3">
                            Transform Your Productivity
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Connect all your favorite tools and get a unified view of your progress across fitness, coding, and learning.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                            <Card key={index} className="border hover:border-primary/50 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1 text-sm">{feature.title}</h3>
                                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center">
                        <Badge variant="secondary" className="text-xs px-3 py-1">
                            Trusted by 10,000+ productivity enthusiasts
                        </Badge>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "Choose Your Integrations",
            subtitle: "Connect the services that matter to you",
            content: (
                <div className="space-y-4">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-foreground mb-2">
                            Available Integrations
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Select the services you want to connect to your dashboard
                        </p>
                    </div>

                    <div className="space-y-3">
                        {integrations.map((integration, index) => (
                            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                <CardContent className="p-0">
                                    <div className="flex">
                                        <div className={`w-16 ${integration.color} flex items-center justify-center`}>
                                            <span className="text-2xl">{integration.logo}</span>
                                        </div>
                                        <div className="flex-1 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-foreground">{integration.name}</h3>
                                                    <p className="text-muted-foreground text-sm">{integration.description}</p>
                                                </div>
                                                <Badge variant="outline" className="group-hover:bg-primary/10 text-xs">
                                                    Popular
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1">
                                                {integration.features.map((feature, featureIndex) => (
                                                    <div key={featureIndex} className="flex items-center space-x-1">
                                                        <Check className="w-3 h-3 text-green-500" />
                                                        <span className="text-xs text-muted-foreground">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">
                            <strong>Pro Tip:</strong> You can connect multiple services to get a complete picture
                        </p>
                        <Badge variant="secondary" className="text-xs">More integrations coming soon!</Badge>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            title: "Ready to Launch!",
            subtitle: "Your productivity hub is configured and ready",
            content: (
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                                <Check className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-foreground">
                            Congratulations! 🎉
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Your Integration Hub is ready to help you track and improve your productivity across all your favorite platforms.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Card className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-white font-bold">1</span>
                            </div>
                            <h3 className="font-semibold text-foreground mb-1 text-sm">Connect Services</h3>
                            <p className="text-xs text-muted-foreground">Link your accounts</p>
                        </Card>

                        <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-white font-bold">2</span>
                            </div>
                            <h3 className="font-semibold text-foreground mb-1 text-sm">Watch Data Flow</h3>
                            <p className="text-xs text-muted-foreground">See real-time stats</p>
                        </Card>

                        <Card className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-white font-bold">3</span>
                            </div>
                            <h3 className="font-semibold text-foreground mb-1 text-sm">Track Progress</h3>
                            <p className="text-xs text-muted-foreground">Monitor trends</p>
                        </Card>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-2xl p-4">
                        <h3 className="font-semibold text-foreground mb-2 text-sm">🚀 Ready to boost your productivity?</h3>
                        <p className="text-muted-foreground mb-3 text-xs">
                            Click "Launch Dashboard" to start your journey towards better productivity tracking.
                        </p>
                        <Badge variant="secondary" className="bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 text-xs">
                            Everything is set up and ready to go!
                        </Badge>
                    </div>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.visit(route('dashboard'));
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        router.visit(route('dashboard'));
    };

    const currentStepData = steps[currentStep];

    return (
        <>
            <Head title="Welcome to Integration Hub" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="container mx-auto px-4 py-4 max-w-4xl h-screen flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                            <AppLogoIcon className="w-8 h-8 text-primary" />
                            <div>
                                <h1 className="text-lg font-bold text-foreground">Integration Hub</h1>
                                <p className="text-xs text-muted-foreground">Setup & Welcome</p>
                            </div>
                        </div>
                        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground text-sm">
                            Skip Setup
                        </Button>
                    </div>

                    {/* Progress */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-muted-foreground">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
                                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-hidden">
                        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full flex flex-col">
                            <CardHeader className="text-center pb-4 pt-6">
                                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                                    {currentStepData.title}
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    {currentStepData.subtitle}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 flex-1 overflow-y-auto">
                                {currentStepData.content}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-4">
                        <Button 
                            variant="outline" 
                            onClick={handlePrevious} 
                            disabled={currentStep === 0}
                            className="flex items-center space-x-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </Button>

                        <div className="flex space-x-2">
                            {steps.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentStep(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentStep 
                                            ? 'bg-primary scale-125 shadow-lg' 
                                            : index < currentStep 
                                                ? 'bg-primary/60 hover:bg-primary/80' 
                                                : 'bg-muted hover:bg-muted-foreground/20'
                                    }`}
                                />
                            ))}
                        </div>

                        <Button 
                            onClick={handleNext}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                        >
                            <span>{currentStep === steps.length - 1 ? 'Launch Dashboard' : 'Continue'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
