import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Smartphone, Star, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLogoIcon from '@/components/app-logo-icon';

export default function OnboardingDemo() {
    const variants = [
        {
            name: "Standard Onboarding",
            description: "Complete onboarding flow with step-by-step guidance",
            href: route('onboarding.index'),
            icon: <Star className="w-6 h-6" />,
            color: "from-blue-500 to-purple-600",
            features: ["3-step process", "Integration selection", "Progress tracking", "Screen-optimized"]
        },
        {
            name: "Mobile Onboarding", 
            description: "Mobile-optimized compact onboarding experience",
            href: route('onboarding.mobile'),
            icon: <Smartphone className="w-6 h-6" />,
            color: "from-green-500 to-teal-600",
            features: ["Mobile-first design", "Touch-friendly", "Compact layout", "Quick setup"]
        },
        {
            name: "Feature-Rich Onboarding",
            description: "Comprehensive onboarding with detailed feature highlights",
            href: route('onboarding.features'),
            icon: <Zap className="w-6 h-6" />,
            color: "from-orange-500 to-red-600",
            features: ["Feature showcase", "Service details", "Compact design", "Advanced flow"]
        }
    ];

    return (
        <>
            <Head title="Onboarding Demo" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
                                <AppLogoIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            Onboarding Screens Demo
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Explore different onboarding flow variants designed for various user experiences and device types.
                        </p>
                        <Badge variant="secondary" className="mt-4">
                            Interactive Prototypes
                        </Badge>
                    </div>

                    {/* Onboarding Variants */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {variants.map((variant, index) => (
                            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                                <div className={`h-2 bg-gradient-to-r ${variant.color}`}></div>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${variant.color} rounded-xl flex items-center justify-center text-white`}>
                                            {variant.icon}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{variant.name}</CardTitle>
                                            <Badge variant="outline" className="text-xs">
                                                Demo Ready
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardDescription className="text-sm leading-relaxed">
                                        {variant.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm text-foreground">Features:</h4>
                                        <ul className="space-y-1">
                                            {variant.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="text-xs text-muted-foreground flex items-center space-x-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <Link href={variant.href}>
                                        <Button className={`w-full group-hover:shadow-lg transition-all bg-gradient-to-r ${variant.color} hover:opacity-90`}>
                                            <span>Try This Flow</span>
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <Star className="w-4 h-4 text-white" />
                                    </div>
                                    <span>Design Principles</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• <strong>Progressive disclosure:</strong> Information revealed step-by-step</li>
                                    <li>• <strong>Clear progress:</strong> Users always know where they are</li>
                                    <li>• <strong>Skip options:</strong> Flexibility for different user needs</li>
                                    <li>• <strong>Visual hierarchy:</strong> Important elements stand out</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <span>Technical Features</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• <strong>React + Inertia.js:</strong> Seamless SPA experience</li>
                                    <li>• <strong>Tailwind CSS:</strong> Responsive and modern styling</li>
                                    <li>• <strong>Radix UI:</strong> Accessible component primitives</li>
                                    <li>• <strong>Smooth animations:</strong> Enhanced user experience</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Navigation */}
                    <div className="text-center mt-12">
                        <Link href={route('dashboard')}>
                            <Button variant="outline" className="mr-4">
                                Back to Dashboard
                            </Button>
                        </Link>
                        <Badge variant="secondary" className="text-xs">
                            All flows redirect to dashboard when completed
                        </Badge>
                    </div>
                </div>
            </div>
        </>
    );
}
