import { ReactNode } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';

interface IntegrationCardProps {
    name: string;
    description: string;
    icon: ReactNode;
    connectionStatus: boolean | null;
    children: ReactNode;
    onClick?: () => void;
}

export default function IntegrationCard({ 
    name, 
    description, 
    icon, 
    connectionStatus, 
    children,
    onClick 
}: IntegrationCardProps) {
    const getConnectionStatusBadge = () => {
        if (connectionStatus === null) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Tekshirilmoqda...
                </span>
            );
        }
        return connectionStatus ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Ulangan
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                Ulanmagan
            </span>
        );
    };

    return (
        <>
            <div className="flex items-center space-x-4 p-4 hover:bg-muted/50 transition cursor-pointer"
                 onClick={onClick}>
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{name}</span>
                        {getConnectionStatusBadge()}
                    </div>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <ChevronRight className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="hidden">
                {children}
            </div>
        </>
    );
}
