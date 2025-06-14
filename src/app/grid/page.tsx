'use client';

import { useEffect, useState } from 'react';
import { Room, Track } from 'livekit-client';
import {
    RoomAudioRenderer,
    RoomContext,
    useTracks,
    VideoTrack,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Wifi, WifiOff } from 'lucide-react';

export default function GridPage() {
    const room = 'quickstart-room';
    const name = 'grid-viewer1';
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
    }, [roomInstance]); const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return 'default';
            case 'connecting': return 'secondary';
            default: return 'destructive';
        }
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-8">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                        <h2 className="text-lg font-semibold mb-2">Connecting to room</h2>
                        <Badge variant={getStatusColor()} className="mb-2">
                            {connectionStatus === 'connected' ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                            {connectionStatus}
                        </Badge>
                        <p className="text-sm text-muted-foreground text-center">
                            Room: {room}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    } return (
        <RoomContext.Provider value={roomInstance}>
            <div className="min-h-screen bg-background">
                {/* Minimal Header */}
                <div className="border-b p-4">
                    <div className="px-16 mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-semibold">UAV Streams</h1>
                            <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                {room}
                            </Badge>
                        </div>
                        <Badge variant={getStatusColor()}>
                            {connectionStatus === 'connected' ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                            {connectionStatus}
                        </Badge>
                    </div>
                </div>

                {/* Grid Container */}
                <div className="p-6">
                    <VideoGrid />
                </div>

                <RoomAudioRenderer />
            </div>
        </RoomContext.Provider>
    );
}

function VideoGrid() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: false },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    // Filter tracks to only include those with active video
    const activeTracks = tracks.filter(track =>
        track.publication &&
        track.publication.isSubscribed &&
        !track.publication.isMuted
    );

    // Calculate grid size based on number of streams
    const getGridCols = (count: number) => {
        if (count <= 1) return 1;
        if (count <= 4) return 2;
        return 3;
    };

    const gridCols = getGridCols(activeTracks.length);
    const maxSlots = gridCols * gridCols;
    const displayTracks = activeTracks.slice(0, maxSlots);

    // Add minimal placeholders only if we have some tracks but grid isn't full
    const needsPlaceholders = displayTracks.length > 0 && displayTracks.length < 4;
    const placeholderCount = needsPlaceholders ? Math.min(4 - displayTracks.length, 3) : 0;

    return (
        <div className="px-16 mx-auto space-y-4">
            {/* Simple Header */}
            <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-sm">
                    {displayTracks.length} active streams
                </Badge>
                {activeTracks.length > maxSlots && (
                    <Badge variant="destructive" className="text-xs">
                        +{activeTracks.length - maxSlots} overflow
                    </Badge>
                )}
            </div>

            {/* Dynamic Grid */}
            {displayTracks.length === 0 ? (
                <Card className="aspect-video max-w-md mx-auto">
                    <CardContent className="flex items-center justify-center h-full p-8">
                        <div className="text-center text-muted-foreground">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3 mx-auto">
                                <Users className="w-8 h-8" />
                            </div>
                            <p className="text-lg font-medium">Waiting for streams</p>
                            <p className="text-sm">No active video streams</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className={"grid grid-cols-3 gap-4"}>
                    {displayTracks.map((track, index) => (
                        <GridSlot key={index} track={track} slotNumber={index + 1} />
                    ))}
                    {Array(placeholderCount).fill(null).map((_, index) => (
                        <GridSlot key={`placeholder-${index}`} track={null} slotNumber={displayTracks.length + index + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

function GridSlot({ track, slotNumber }: { track: any; slotNumber: number }) {
    if (!track) {
        return (
            <Card className="aspect-video border-dashed border-muted bg-muted/20">
                <CardContent className="flex items-center justify-center h-full p-2">
                    <div className="text-center text-muted-foreground">
                        <div className="w-6 h-6 bg-muted/50 rounded-full flex items-center justify-center mb-1 mx-auto">
                            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
                        </div>
                        <p className="text-xs">{slotNumber}</p>
                    </div>
                </CardContent>
            </Card>
        );
    } const participant = track.participant;
    const isLocal = participant.isLocal;
    const isScreenShare = track.source === Track.Source.ScreenShare;

    return (
        <Card className="relative aspect-video overflow-hidden group hover:ring-1 hover:ring-primary/50 transition-all">
            <CardContent className="p-0 h-full">
                {/* Video Content */}
                {track.publication && (
                    <VideoTrack
                        trackRef={track as any}
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Minimal Participant Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-2">
                    <div className="flex items-center justify-between">
                        <p className="text-white text-xs font-medium truncate">
                            {participant.name || participant.identity}
                            {isLocal && ' (You)'}
                        </p>
                        <div className="flex items-center gap-1">
                            {/* Audio indicator */}
                            <div className={`w-1.5 h-1.5 rounded-full ${track.publication?.isMuted === false ? 'bg-green-400' : 'bg-red-400/80'
                                }`}></div>
                        </div>
                    </div>
                </div>

                {/* Screen Share Badge */}
                {isScreenShare && (
                    <Badge variant="secondary" className="absolute top-2 left-2 text-xs py-0 px-2">
                        Screen
                    </Badge>
                )}

                {/* Slot number (subtle) */}
                <div className="absolute top-1 right-1 text-white/60 text-xs font-mono">
                    {slotNumber}
                </div>
            </CardContent>
        </Card>
    );
}
