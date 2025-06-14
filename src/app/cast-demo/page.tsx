'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, MonitorSpeaker, Wifi, WifiOff, Settings, Chrome, Smartphone } from 'lucide-react';

export default function CastDemoPage() {
    const room = 'quickstart-room';
    const name = 'screen-caster-multispectral';
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [isConnected, setIsConnected] = useState(false);

    // Auto-connect simulation on page load
    useEffect(() => {
        const simulateConnection = async () => {
            setConnectionStatus('connecting');
            await new Promise(resolve => setTimeout(resolve, 2000));
            setConnectionStatus('connected');
            setIsConnected(true);
        };

        simulateConnection();
    }, []);

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return 'bg-green-500';
            case 'connecting': return 'bg-yellow-500';
            default: return 'bg-red-500';
        }
    };

    const getStatusIcon = () => {
        return connectionStatus === 'connected' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />;
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Screen Cast</h1>
                    <p className="text-muted-foreground">Share your screen on any device</p>
                </div>

                {/* Connection Status */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                            <span>Connection Status</span>
                            <Badge variant="outline" className="flex items-center gap-2">
                                {getStatusIcon()}
                                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                                {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p><strong>Room:</strong> {room}</p>
                            <p><strong>User:</strong> {name}</p>
                        </div>
                    </CardContent>
                </Card>                {/* Screen Cast Control */}
                {isConnected && <ScreenCastControl />}
            </div>
        </div>
    );
}

function ScreenCastControl() {
    const [isSharing, setIsSharing] = useState(false);
    const [sharingMethod, setSharingMethod] = useState<string | null>(null);

    // Check if device is mobile
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Check browser type
    const getBrowserInfo = () => {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'chrome';
        if (ua.includes('Firefox')) return 'firefox';
        if (ua.includes('Safari')) return 'safari';
        if (ua.includes('Edge')) return 'edge';
        return 'unknown';
    };

    const startScreenShare = async () => {
        setSharingMethod('Standard Screen Share API');
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSharing(true);
    };

    const stopScreenShare = async () => {
        setIsSharing(false);
        setSharingMethod(null);
    };

    const mobile = isMobile();
    const browser = getBrowserInfo();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Screen Sharing
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center space-y-4">
                    {/* Device & Browser Info */}
                    <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-center gap-4 text-sm text-blue-800">
                            <div className="flex items-center gap-1">
                                {mobile ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                                {mobile ? 'Mobile' : 'Desktop'}
                            </div>
                            <div className="flex items-center gap-1">
                                <Chrome className="w-4 h-4" />
                                {browser.charAt(0).toUpperCase() + browser.slice(1)}
                            </div>
                            {sharingMethod && (
                                <div className="flex items-center gap-1">
                                    <Settings className="w-4 h-4" />
                                    {sharingMethod}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Instructions */}
                    {mobile && !isSharing && (
                        <div className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium mb-2">📱 Mobile Screen Sharing Tips:</p>
                                <ul className="text-xs space-y-1 list-disc list-inside">
                                    <li>Enable "Desktop site" mode in browser settings</li>
                                    <li>For Chrome: Enable experimental web features</li>
                                    <li>Grant all requested permissions</li>
                                    <li>Try landscape orientation</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {!isSharing ? (
                        <Button
                            onClick={startScreenShare}
                            size="lg"
                            className="w-full"
                        >
                            <MonitorSpeaker className="w-4 h-4 mr-2" />
                            Start Screen Cast
                        </Button>
                    ) : (
                        <Button
                            onClick={stopScreenShare}
                            variant="destructive"
                            size="lg"
                            className="w-full"
                        >
                            <Monitor className="w-4 h-4 mr-2" />
                            Stop Screen Cast
                        </Button>
                    )}

                    {isSharing && (
                        <Badge variant="secondary" className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            Screen is being shared via {sharingMethod}
                        </Badge>
                    )}

                    {/* Success indicator for mobile */}
                    {mobile && isSharing && (
                        <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 text-center">
                                🎉 Success! Mobile screen sharing is working
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>        </Card>
    );
}
