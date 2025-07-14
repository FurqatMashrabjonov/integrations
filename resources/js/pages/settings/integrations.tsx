import { Head, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Check, ChevronRight, TimerIcon } from 'lucide-react';
import { Appearance } from '@/hooks/use-appearance';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle, DrawerTrigger
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import Markdown from 'react-markdown';

const markdown = '# 🧠 LeetCode — Dasturchilar Uchun Algoritmik O‘yingoh\n' +
    '\n' +
    '![LeetCode Logo](https://leetcode.com/static/images/LeetCode_logo_rvs.png)\n' +
    '\n' +
    '> **“Practice makes perfect.”** — LeetCode shiori\n' +
    '\n' +
    '---\n' +
    '\n' +
    '## 📌 Nima bu LeetCode?\n' +
    '\n' +
    '**LeetCode** — bu onlayn platforma bo‘lib, u algoritmik masalalar, texnik intervyularga tayyorgarlik, va kod yozish ko‘nikmalarini oshirish uchun mo‘ljallangan.\n' +
    '\n' +
    '### 🎯 Asosiy xususiyatlari:\n' +
    '\n' +
    '- 2800+ dan ortiq masalalar\n' +
    '- 14+ dasturlash tillarida yechim yozish imkoniyati\n' +
    '- Real kompaniyalar (Google, Meta, Amazon) intervyu savollari\n' +
    '- Har kuni yangi *“Daily Challenge”*\n' +
    '- **Discussion**, **Contest** va **Explore** bo‘limlari\n' +
    '\n' +
    '---\n' +
    '\n' +
    '## 🛠 Platforma bo‘limlari\n' +
    '\n' +
    '### 📚 Masalalar\n' +
    '\n' +
    '```text\n' +
    'Kategoriya: Array, Graph, DP, Binary Tree, HashMap va h.k.\n' +
    'Daraja: Easy, Medium, Hard\n'


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/integrations',
    },
];

export default function Integrations() {
    const { auth } = usePage<SharedData>().props;
    const integrations = auth.user.integrations || [];

    const getIntegrationIcon = (integration: string) => {
        return Array.isArray(integrations) && integrations.indexOf(integration) !== -1 ? (
            <Check className="text-muted-foreground h-4 w-4" />
        ) : (
            <ChevronRight className="text-muted-foreground h-4 w-4" />
        );
    };

    const isIntegrated = (integration: string) => {
        return Array.isArray(integrations) && integrations.indexOf(integration) !== -1;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Integrations" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Integration settings"
                        // description="Set your integrations: Github, Leetcode, Wakapi, Fitbit"
                    />

                    {/* iOS style section */}
                    <div className="bg-background text-foreground divide-y rounded-xl border shadow-sm">
                        {/* Github */}
                        <div
                            onClick={() => {
                                if (!isIntegrated('github')) {
                                    window.location.href = route('integrations.github.redirect');
                                }
                            }}
                            className="hover:bg-muted/50 flex cursor-pointer items-center space-x-4 px-4 py-3 transition"
                        >
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="p-1" viewBox="0 0 128 128" id="github">
                                    <g fill={((localStorage.getItem('appearance') as Appearance) === 'dark' ? '#fff' : '#000')}>
                                        <path
                                            fill-rule="evenodd"
                                            d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
                                            clipRule="evenodd"
                                        ></path>
                                        <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm-.743-.55M28.93 94.535c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zm-.575-.618M31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm0 0M34.573 101.373c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm0 0M39.073 103.324c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm0 0M44.016 103.685c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm0 0M48.614 102.903c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path>
                                    </g>
                                </svg>
                            </div>
                            <span className="flex-1 text-sm">Githubni ulash</span>
                            {getIntegrationIcon('github')}
                        </div>

                        {/* Fitbit */}
                        <div
                            onClick={() => {
                                // if (!isIntegrated('fitbit')) {
                                    window.location.href = route('integrations.fitbit.redirect');
                                // }
                            }}
                            className="hover:bg-muted/50 flex cursor-pointer items-center space-x-4 px-4 py-3 transition"
                        >
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="p-1" viewBox="0 0 24 24" id="fitbit">
                                    <path
                                        fill="#28B0B9"
                                        d="M11.512 3.582c.976 0 1.786-.812 1.786-1.791 0-.975-.81-1.791-1.786-1.791-.971 0-1.784.815-1.784 1.791 0 .978.812 1.791 1.784 1.791zm.002 5.206a1.839 1.839 0 0 0 1.865-1.871 1.85 1.85 0 0 0-1.871-1.872c-1.05.002-1.859.814-1.859 1.872 0 1.057.81 1.871 1.865 1.871zm-5.028 6.658v.012a1.628 1.628 0 0 0 0 3.253c.893 0 1.619-.737 1.619-1.64a1.62 1.62 0 0 0-1.619-1.625zm-.023-5.112.012.001.011-.001h-.023zm5.045 4.881c-1.05.002-1.859.814-1.859 1.87 0 1.057.81 1.872 1.865 1.872 1.053 0 1.865-.814 1.865-1.872 0-.974-.823-1.868-1.871-1.87zm-5.033-4.88c-.967.006-1.692.734-1.692 1.708 0 .978.721 1.709 1.695 1.709s1.695-.732 1.695-1.709c0-.975-.729-1.702-1.698-1.708zM11.504 5.045h.008zM11.514 10.091h-.002c-1.052 0-1.945.894-1.945 1.951s.894 1.952 1.947 1.952 1.946-.894 1.946-1.952-.894-1.951-1.946-1.951zm-.002 10.332c-.972 0-1.784.812-1.784 1.79 0 .973.813 1.787 1.784 1.787a1.8 1.8 0 0 0 1.786-1.79 1.8 1.8 0 0 0-1.786-1.787zM11.504 15.215h.008z"
                                    ></path>
                                    <ellipse cx="16.46" cy="12.042" fill="#28B0B9" rx="2.189" ry="2.196"></ellipse>
                                    <path
                                        fill="#28B0B9"
                                        d="M14.352 6.917c0 1.138.973 2.114 2.108 2.114s2.106-.978 2.106-2.114c0-1.139-.972-2.116-2.106-2.116v-.002c-1.136 0-2.108.98-2.108 2.118zm7.214 2.675V9.6a2.443 2.443 0 0 0-2.43 2.442c0 1.301 1.051 2.441 2.43 2.441 1.381 0 2.434-1.069 2.434-2.452-.082-1.386-1.135-2.439-2.434-2.439zm-5.106 9.609c1.135 0 2.106-.979 2.106-2.116s-.971-2.114-2.106-2.114c-1.136 0-2.108.979-2.108 2.114 0 1.139.973 2.116 2.108 2.116zM4.866 6.918c0 .894.729 1.625 1.62 1.625a1.625 1.625 0 0 0 0-3.251V5.29c-.892 0-1.62.732-1.62 1.628z"
                                    ></path>
                                    <ellipse cx="1.46" cy="12.042" fill="#28B0B9" rx="1.459" ry="1.464"></ellipse>
                                </svg>
                            </div>
                            <span className="flex-1 text-sm">Fitbitni ulash</span>
                            {getIntegrationIcon('fitbit')}
                        </div>

                        {/* Leetcode */}

                        <Drawer>
                            <DrawerTrigger>Open</DrawerTrigger>
                            <DrawerContent className="flex flex-col h-[90vh]"> {/* Important! */}
                                <div className="sticky top-0 z-10 bg-background">
                                    <DrawerHeader>
                                        <DrawerTitle>
                                            <Markdown>
                                                {markdown}
                                            </Markdown>
                                        </DrawerTitle>
                                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                                    </DrawerHeader>
                                </div>

                                {/* Scrollable content */}
                                <div className="overflow-y-auto px-4 py-2 flex-1">
                                    {/* Your scrollable content here */}
                                    <p>Bu yerda markdown content juda uzun bo‘lsa, scroll ishlaydi</p>
                                    {/* qo‘shimcha content */}
                                </div>

                                <DrawerFooter className="bg-background sticky bottom-0 z-10">
                                    <Button>Submit</Button>
                                    <DrawerClose>
                                        <Button variant="outline">Cancel</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>

                        <div
                            className="hover:bg-muted/50 flex cursor-pointer items-center space-x-4 px-4 py-3 transition"
                        >
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="p-1" viewBox="0 0 24 24" id="leetcode">
                                    <path
                                        fill="#B3B1B0"
                                        d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"
                                    ></path>
                                    <path
                                        fill="#E7A41F"
                                        d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"
                                    ></path>
                                    <path
                                        fill="#070706"
                                        d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"
                                    ></path>
                                </svg>
                            </div>
                            <span className="flex-1 text-sm">Leetcodeni ulash</span>
                            {getIntegrationIcon('leetcode')}
                        </div>

                        {/* Wakapi */}
                        <div
                            onClick={() => {
                                if (!isIntegrated('wakapi')) {
                                    window.location.href = route('integrations.github.redirect');
                                }
                            }}
                            className="hover:bg-muted/50 flex cursor-pointer items-center space-x-4 px-4 py-3 transition"
                        >
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
                                <TimerIcon className="text-muted-foreground h-5 w-5" />
                            </div>
                            <span className="flex-1 text-sm">Wakapini ulash</span>
                            {getIntegrationIcon('wakapi')}
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
