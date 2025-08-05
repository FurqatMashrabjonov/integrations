import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLogoIcon from '@/components/app-logo-icon';

interface OnboardingStep {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    content: React.ReactNode;
}

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0);

    const steps: OnboardingStep[] = [
        {
            id: 1,
            title: "Welcome to Integration Hub",
            description: "Connect all your favorite productivity tools in one place",
            icon: <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <AppLogoIcon className="w-6 h-6 text-white" />
            </div>,
            content: (
                <div className="text-center space-y-4">
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">Welcome to your productivity hub!</h2>
                        <p className="text-muted-foreground">
                            Track your fitness, coding stats, and problem-solving progress in one dashboard.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        <div className="flex flex-col items-center space-y-2 p-3 bg-muted/50 rounded-lg">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium">Fitness</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 p-3 bg-muted/50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium">Coding</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 p-3 bg-muted/50 rounded-lg">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium">Learning</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "Choose Your Integrations",
            description: "Select the services you want to connect",
            icon: <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
            </div>,
            content: (
                <div className="space-y-4">
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold text-foreground">Connect Your Favorite Tools</h2>
                        <p className="text-muted-foreground text-sm">
                            Choose which services you'd like to integrate
                        </p>
                    </div>
                    <div className="space-y-2">
                        {[
                            { name: "Fitbit", description: "Track steps, sleep, and fitness", logo: "💪", color: "bg-green-50 border-green-200" },
                            { name: "WakaTime", description: "Monitor coding time and projects", logo: "⏱️", color: "bg-blue-50 border-blue-200" },
                            { name: "LeetCode", description: "Track problem-solving progress", logo: "🧩", color: "bg-purple-50 border-purple-200" },
                        ].map((integration, index) => (
                            <Card key={index} className={`cursor-pointer transition-all hover:shadow-md ${integration.color}`}>
                                <CardContent className="flex items-center space-x-3 p-3">
                                    <div className="text-xl">{integration.logo}</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground text-sm">{integration.name}</h3>
                                        <p className="text-xs text-muted-foreground">{integration.description}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 3,
            title: "You're All Set!",
            description: "Start tracking your productivity journey",
            icon: <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
            </div>,
            content: (
                <div className="text-center space-y-4">
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">Congratulations! 🎉</h2>
                        <p className="text-muted-foreground">
                            Your integration hub is ready. Start connecting your services and tracking your progress!
                        </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-foreground text-sm">Dashboard Setup Complete</h3>
                                <p className="text-xs text-muted-foreground">Your workspace is ready</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="font-semibold text-foreground mb-1">Next Steps</div>
                            <ul className="text-muted-foreground space-y-1 text-left">
                                <li>• Connect integrations</li>
                                <li>• Explore dashboard</li>
                                <li>• Set up notifications</li>
                            </ul>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="font-semibold text-foreground mb-1">Need Help?</div>
                            <ul className="text-muted-foreground space-y-1 text-left">
                                <li>• Visit help center</li>
                                <li>• Check guides</li>
                                <li>• Contact support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Complete onboarding and redirect to dashboard
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
            <Head title="Getting Started" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-3xl h-screen flex flex-col justify-between py-6">
                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-3">
                            <h1 className="text-sm font-medium text-muted-foreground">
                                Step {currentStep + 1} of {steps.length}
                            </h1>
                            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
                                Skip for now
                            </Button>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex items-center justify-center">
                        <Card className="shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm w-full">
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <div className="flex justify-center mb-4">
                                        {currentStepData.icon}
                                    </div>
                                    <h1 className="text-2xl font-bold text-foreground mb-2">
                                        {currentStepData.title}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {currentStepData.description}
                                    </p>
                                </div>

                                <div className="max-w-xl mx-auto">
                                    {currentStepData.content}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-6">
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
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        index === currentStep 
                                            ? 'bg-primary scale-110' 
                                            : index < currentStep 
                                                ? 'bg-primary/60' 
                                                : 'bg-muted'
                                    }`}
                                />
                            ))}
                        </div>

                        <Button 
                            onClick={handleNext}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
