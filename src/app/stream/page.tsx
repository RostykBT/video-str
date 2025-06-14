'use client';

import { useEffect, useState, useRef } from 'react';
import { Room, Track, createLocalVideoTrack, createLocalAudioTrack } from 'livekit-client';
import {
    ControlBar,
    RoomAudioRenderer,
    RoomContext,
    VideoTrack,
    useLocalParticipant,
    useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';

export default function StreamPage() {
    // TODO: get user input for room and name
    const room = 'quickstart-room';
    const name = 'streamer-user';
    const [roomInstance] = useState(() => new Room({
        // Optimize video quality for each participant's screen
        adaptiveStream: true,
        // Enable automatic audio/video quality optimization
        dynacast: true,
    }));
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const resp = await fetch(`/api/token?room=${room}&username=${name}`);
                const data = await resp.json();
                if (!mounted) return; if (data.token) {
                    await roomInstance.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, data.token);
                    setIsConnected(true);
                }
            } catch (e) {
                console.error(e);
            }
        })();

        return () => {
            mounted = false;
            roomInstance.disconnect();
            setIsConnected(false);
        };
    }, [roomInstance]);

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Connecting to room...</p>
                </div>
            </div>
        );
    }

    return (
        <RoomContext.Provider value={roomInstance}>
            <div data-lk-theme="default" className="min-h-screen bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-white mb-8 text-center">
                        Live Stream to Room
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Local Video Preview */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Your Camera</h2>
                            <LocalVideoPreview />
                        </div>

                        {/* Stream Controls */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Stream Controls</h2>
                            <StreamControls />
                        </div>
                    </div>

                    {/* Room Participants */}
                    <div className="mt-8 bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Room Participants</h2>
                        <RoomParticipants />
                    </div>
                </div>

                {/* Audio Renderer and Control Bar */}
                <RoomAudioRenderer />
                <div className="fixed bottom-0 left-0 right-0">
                    <ControlBar />
                </div>
            </div>
        </RoomContext.Provider>
    );
}

function LocalVideoPreview() {
    const { localParticipant } = useLocalParticipant();
    const [videoTrack, setVideoTrack] = useState<any>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const initCamera = async () => {
            try {
                const track = await createLocalVideoTrack({
                    resolution: { width: 1280, height: 720 },
                    facingMode: 'user'
                });
                setVideoTrack(track);

                if (videoRef.current) {
                    track.attach(videoRef.current);
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };

        initCamera();

        return () => {
            if (videoTrack) {
                videoTrack.stop();
            }
        };
    }, []);

    const startPublishing = async () => {
        if (videoTrack && localParticipant) {
            try {
                await localParticipant.publishTrack(videoTrack);
                setIsPublishing(true);
            } catch (error) {
                console.error('Error publishing video track:', error);
            }
        }
    };

    const stopPublishing = async () => {
        if (localParticipant) {
            try {
                const publication = localParticipant.getTrackPublication(Track.Source.Camera);
                if (publication) {
                    await localParticipant.unpublishTrack(publication.track!);
                    setIsPublishing(false);
                }
            } catch (error) {
                console.error('Error unpublishing video track:', error);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
                {!videoTrack && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        <p>No camera access</p>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                {!isPublishing ? (
                    <button
                        onClick={startPublishing}
                        disabled={!videoTrack}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Start Streaming
                    </button>
                ) : (
                    <button
                        onClick={stopPublishing}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Stop Streaming
                    </button>
                )}
            </div>
        </div>
    );
}

function StreamControls() {
    const { localParticipant } = useLocalParticipant();
    const [audioTrack, setAudioTrack] = useState<any>(null);
    const [isAudioPublishing, setIsAudioPublishing] = useState(false);

    useEffect(() => {
        const initAudio = async () => {
            try {
                const track = await createLocalAudioTrack();
                setAudioTrack(track);
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        };

        initAudio();

        return () => {
            if (audioTrack) {
                audioTrack.stop();
            }
        };
    }, []);

    const startAudioPublishing = async () => {
        if (audioTrack && localParticipant) {
            try {
                await localParticipant.publishTrack(audioTrack);
                setIsAudioPublishing(true);
            } catch (error) {
                console.error('Error publishing audio track:', error);
            }
        }
    };

    const stopAudioPublishing = async () => {
        if (localParticipant) {
            try {
                const publication = localParticipant.getTrackPublication(Track.Source.Microphone);
                if (publication) {
                    await localParticipant.unpublishTrack(publication.track!);
                    setIsAudioPublishing(false);
                }
            } catch (error) {
                console.error('Error unpublishing audio track:', error);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-white">Microphone</span>
                    <div className="flex gap-2">
                        {!isAudioPublishing ? (
                            <button
                                onClick={startAudioPublishing}
                                disabled={!audioTrack}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Enable Audio
                            </button>
                        ) : (
                            <button
                                onClick={stopAudioPublishing}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Disable Audio
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-600 pt-4">
                <h3 className="text-lg font-medium text-white mb-2">Stream Info</h3>
                <div className="space-y-2 text-sm text-gray-300">                    <p>Room: quickstart-room</p>
                    <p>Username: streamer-user</p>
                    <p>Status: {localParticipant ? 'Connected' : 'Disconnected'}</p>
                </div>
            </div>
        </div>
    );
}

function RoomParticipants() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: false },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.map((trackRef) => {
                if (!trackRef.publication) return null;
                return (
                    <div key={trackRef.publication.trackSid} className="relative bg-black rounded-lg overflow-hidden aspect-video">
                        <VideoTrack
                            trackRef={trackRef as any}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                            {trackRef.participant.name || trackRef.participant.identity}
                        </div>
                    </div>
                );
            })}
            {tracks.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-8">
                    No other participants in the room
                </div>
            )}
        </div>
    );
}
