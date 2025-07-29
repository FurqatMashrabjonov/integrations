'use client'

import {
    Card,
    CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function StepsSection({ steps }: { steps: string }) {
    return (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row gap-4">
                        <Card className="rounded-3xl w-full h-full">
                            <CardHeader className="text-start text-foreground text-md-left">
                                <CardTitle>Bugungi qadamlar</CardTitle>
                            </CardHeader>
                            <CardContent className="">asdasd</CardContent>
                        </Card>
                        <Card className="rounded-3xl w-full">
                            <CardHeader className="px-10 pt-8 pb-0 text-center">
                                <CardTitle className="text-xl">slom</CardTitle>
                                <CardDescription>das</CardDescription>
                            </CardHeader>
                            <CardContent className="px-10 py-8">asdasd</CardContent>
                        </Card>
                    </div>

                </div>
        // <Card className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl text-white shadow-sm">
        //     <CardContent className="p-6 space-y-6">
        //         {/* Header */}
        //         <div className="text-center space-y-1">
        //             <p className="text-sm text-zinc-400">Qadamlar soni</p>
        //             <p className="text-xs text-zinc-500">Bugungi qadamlar statistikasi</p>
        //         </div>
        //
        //         {/* Circle counter */}
        //         <div className="flex justify-center">
        //             <div className="w-32 h-32 rounded-full border border-zinc-700 flex items-center justify-center">
        //                 <span className="text-3xl font-bold text-[#f87171]">{steps}</span>
        //             </div>
        //         </div>
        //
        //     </CardContent>
        // </Card>
    )
}
