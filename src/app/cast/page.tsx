'use client';

import { useEffect, useState, useRef } from 'react';
import { Room, Track } from 'livekit-client';
import { RoomAudioRenderer, RoomContext, useLocalParticipant } from '@livekit/components-react';
import '@livekit/components-styles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, MonitorSpeaker, Wifi, WifiOff, Settings, Chrome, Smartphone } from 'lucide-react';

export default function CastPage() {
    const room = 'quickstart-room';
    const name = 'screen-caster-multispectral';
    const [roomInstance] = useState(() => new Room({
        adaptiveStream: true,
        dynacast: true,
    }));
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

    useEffect(() => {
        let mounted = true;
        setConnectionStatus('connecting');

        (async () => {
            try {
                const resp = await fetch(`/api/token?room=${room}&username=${name}`);
                const data = await resp.json();
                if (!mounted) return;

                if (data.token) {
                    await roomInstance.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, data.token);
                    setIsConnected(true);
                    setConnectionStatus('connected');
                }
            } catch (e) {
                console.error(e);
                setConnectionStatus('disconnected');
            }
        })();

        return () => {
            mounted = false;
            roomInstance.disconnect();
            setIsConnected(false);
            setConnectionStatus('disconnected');
        };
    }, [roomInstance]);

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
        <RoomContext.Provider value={roomInstance}>
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
                    </Card>

                    {/* Screen Cast Control */}
                    {isConnected && <ScreenCastControl />}

                    {/* Screen Preview */}
                    {isConnected && <ScreenPreview />}
                </div>

                <RoomAudioRenderer />
            </div>
        </RoomContext.Provider>
    );
}

function ScreenCastControl() {
    const { localParticipant } = useLocalParticipant();
    const [isSharing, setIsSharing] = useState(false);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
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

    // Multiple screen sharing strategies
    const attemptScreenShare = async (): Promise<MediaStream> => {
        const browser = getBrowserInfo();
        const mobile = isMobile();

        console.log(`Attempting screen share on ${mobile ? 'mobile' : 'desktop'} ${browser}`);

        // Strategy 1: Standard getDisplayMedia (works on most modern browsers)
        if (navigator.mediaDevices?.getDisplayMedia) {
            try {
                setSharingMethod('Standard Screen Share API');
                return await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        frameRate: { ideal: 30 }
                    },
                    audio: true
                });
            } catch (err) {
                console.log('Standard getDisplayMedia failed:', err);
            }
        }

        // Strategy 2: Chrome mobile with experimental flags
        if (mobile && browser === 'chrome') {
            try {
                setSharingMethod('Chrome Mobile Experimental');
                // Chrome Android with --enable-experimental-web-platform-features
                const stream = await (navigator.mediaDevices as any).getDisplayMedia({
                    video: { mediaSource: 'screen' },
                    audio: true
                });
                return stream;
            } catch (err) {
                console.log('Chrome mobile experimental failed:', err);
            }
        }

        // Strategy 3: Try with different video source constraints
        if (mobile) {
            try {
                setSharingMethod('Mobile Video Source Override');
                return await navigator.mediaDevices.getUserMedia({
                    video: {
                        mediaSource: 'screen' as any,
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    },
                    audio: true
                } as any);
            } catch (err) {
                console.log('Mobile video source override failed:', err);
            }
        }

        // Strategy 4: Desktop site mode detection and handling
        if (mobile) {
            try {
                setSharingMethod('Desktop Mode Fallback');
                // Force desktop mode constraints
                return await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { min: 1024, ideal: 1920 },
                        height: { min: 768, ideal: 1080 },
                        aspectRatio: { ideal: 16 / 9 }
                    },
                    audio: true
                });
            } catch (err) {
                console.log('Desktop mode fallback failed:', err);
            }
        }

        // Strategy 5: Legacy WebRTC APIs
        try {
            setSharingMethod('Legacy WebRTC API');
            if ((navigator as any).webkitGetUserMedia) {
                return new Promise((resolve, reject) => {
                    (navigator as any).webkitGetUserMedia({
                        video: { mediaSource: 'screen' },
                        audio: true
                    }, resolve, reject);
                });
            }
        } catch (err) {
            console.log('Legacy WebRTC API failed:', err);
        }

        throw new Error(`No screen sharing method available for ${mobile ? 'mobile' : 'desktop'} ${browser}`);
    };

    const startScreenShare = async () => {
        if (!localParticipant) return;

        setError(null);
        setSharingMethod(null);

        try {
            const stream = await attemptScreenShare();
            const videoTrack = stream.getVideoTracks()[0];

            await localParticipant.publishTrack(videoTrack, {
                source: Track.Source.ScreenShare,
                name: 'screen'
            });

            setScreenStream(stream);
            setIsSharing(true);

            // Handle when user stops sharing
            videoTrack.addEventListener('ended', () => {
                setIsSharing(false);
                setScreenStream(null);
                setSharingMethod(null);
            });

        } catch (error: any) {
            console.error('All screen sharing strategies failed:', error);

            const mobile = isMobile();
            const browser = getBrowserInfo();

            if (error.name === 'NotAllowedError') {
                setError("Screen sharing permission was denied. Please allow screen sharing and try again.");
            } else if (error.name === 'NotSupportedError') {
                if (mobile) {
                    setError(`Screen sharing is not supported on mobile ${browser}. Try:\n• Enable "Desktop site" mode\n• Use Chrome with experimental flags\n• Install as PWA`);
                } else {
                    setError("Screen sharing is not supported in this browser. Try Chrome, Firefox, or Edge.");
                }
            } else {
                if (mobile) {
                    setError(`Mobile screen sharing failed. For ${browser}:\n• Enable "Desktop site" mode\n• Allow all permissions\n• Try desktop browser if available`);
                } else {
                    setError("Screen sharing failed. Please check permissions and try again.");
                }
            }
        }
    };

    const stopScreenShare = async () => {
        if (!localParticipant) return;

        try {
            const publication = localParticipant.getTrackPublication(Track.Source.ScreenShare);
            if (publication) {
                await localParticipant.unpublishTrack(publication.track!);
            }

            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
                setScreenStream(null);
            }

            setIsSharing(false);
            setSharingMethod(null);
        } catch (error) {
            console.error('Error stopping screen share:', error);
        }
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
                    {/* Error Message */}
                    {error && (
                        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 whitespace-pre-line text-center">{error}</p>
                        </div>
                    )}

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
            </CardContent>
        </Card>
    );
}

function ScreenPreview() {
    const { localParticipant } = useLocalParticipant();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasScreenTrack, setHasScreenTrack] = useState(false);

    useEffect(() => {
        if (!localParticipant) return;

        const updateScreenTrack = () => {
            const publication = localParticipant.getTrackPublication(Track.Source.ScreenShare);
            if (publication && publication.track && videoRef.current) {
                publication.track.attach(videoRef.current);
                setHasScreenTrack(true);
            } else {
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
                setHasScreenTrack(false);
            }
        };

        // Initial check
        updateScreenTrack();

        // Listen for track changes
        localParticipant.on('trackPublished', updateScreenTrack);
        localParticipant.on('trackUnpublished', updateScreenTrack);

        return () => {
            localParticipant.off('trackPublished', updateScreenTrack);
            localParticipant.off('trackUnpublished', updateScreenTrack);
        };
    }, [localParticipant]);

    if (!hasScreenTrack) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Screen Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
