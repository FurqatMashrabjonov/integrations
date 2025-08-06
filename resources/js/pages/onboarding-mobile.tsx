import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLogoIcon from '@/components/app-logo-icon';

export default function OnboardingMobile() {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Welcome!",
            subtitle: "Your productivity hub",
            description: "Track fitness, coding, and learning progress all in one place.",
            emoji: "🚀",
            gradient: "from-blue-500 to-purple-600"
        },
        {
            title: "Connect Tools",
            subtitle: "Choose integrations",
            description: "Link Fitbit, WakaTime, LeetCode and more to your dashboard.",
            emoji: "🔗",
            gradient: "from-green-500 to-teal-600"
        },
        {
            title: "All Set!",
            subtitle: "Start tracking",
            description: "Your integration hub is ready. Begin your productivity journey!",
            emoji: "✨",
            gradient: "from-green-500 to-emerald-600"
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.visit(route('dashboard'));
        }
    };

    const handleSkip = () => {
        router.visit(route('dashboard'));
    };

    const currentStepData = steps[currentStep];

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 pb-4">
                    <div className="flex items-center space-x-3">
                        <AppLogoIcon className="w-8 h-8 text-primary" />
                        <span className="font-bold text-lg text-foreground">Integration Hub</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
                        Skip
                    </Button>
                </div>

                {/* Progress */}
                <div className="px-6 mb-8">
                    <div className="flex space-x-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                                }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        {currentStep + 1} of {steps.length}
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex-1 px-6 flex flex-col justify-center">
                    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                        <CardContent className="p-8 text-center">
                            {/* Emoji/Icon */}
                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${currentStepData.gradient} mb-6`}>
                                <span className="text-3xl">{currentStepData.emoji}</span>
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground mb-2">
                                        {currentStepData.title}
                                    </h1>
                                    <p className="text-lg font-medium text-primary">
                                        {currentStepData.subtitle}
                                    </p>
                                </div>
                                
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {currentStepData.description}
                                </p>
                            </div>

                            {/* Step-specific content */}
                            {currentStep === 1 && (
                                <div className="mt-8 space-y-3">
                                    {[
                                        { name: "Fitbit", icon: "💪" },
                                        { name: "WakaTime", icon: "⏱️" },
                                        { name: "LeetCode", icon: "🧩" }
                                    ].map((service, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xl">{service.icon}</span>
                                                <span className="font-medium text-foreground">{service.name}</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl">
                                    <div className="flex items-center justify-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                                            <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="font-semibold text-green-800 dark:text-green-200">Ready to go!</span>
                                    </div>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        Your personalized dashboard awaits
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation */}
                <div className="p-6 pt-4">
                    <Button 
                        onClick={handleNext}
                        className={`w-full h-14 text-lg font-semibold bg-gradient-to-r ${currentStepData.gradient} hover:opacity-90 transition-all`}
                        size="lg"
                    >
                        <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    {currentStep < steps.length - 1 && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => setCurrentStep(steps.length - 1)}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Skip to end
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
