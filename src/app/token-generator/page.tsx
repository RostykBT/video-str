'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Key, Copy, ArrowLeft, Server, User, Hash } from 'lucide-react';

export default function TokenGenerator() {
    const [room, setRoom] = useState('quickstart-room');
    const [username, setUsername] = useState('screen-caster-multispectral');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateToken = async () => {
        if (!room || !username) {
            setError('Please provide both room name and username');
            return;
        }

        setLoading(true);
        setError('');
        setToken('');

        try {
            const response = await fetch(`/api/token?room=${encodeURIComponent(room)}&username=${encodeURIComponent(username)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate token');
            }

            setToken(data.token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // You could use a toast notification here instead of alert
            alert(`${type} copied to clipboard!`);
        } catch (err) {
            console.error(`Failed to copy ${type}:`, err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">
                        LiveKit Token Generator
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Generate access tokens for LiveKit video rooms
                    </p>
                </div>

                {/* Back to Home Link */}
                <div>
                    <Button variant="ghost" asChild>
                        <Link href="/" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                {/* Token Generator Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="w-5 h-5" />
                            Generate New Token
                        </CardTitle>
                        <CardDescription>
                            Enter room name and username to generate a LiveKit access token
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="room" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Room Name
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        id="room"
                                        value={room}
                                        onChange={(e) => setRoom(e.target.value)}
                                        placeholder="Enter room name"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={generateToken}
                            disabled={loading || !room || !username}
                            className="w-full"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Key className="w-4 h-4" />
                                    Generate Token
                                </>
                            )}
                        </Button>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Token Display */}
                {token && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="w-5 h-5" />
                                Generated Token
                            </CardTitle>
                            <CardDescription>
                                Your LiveKit access token and connection details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                                    <Hash className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Room</p>
                                        <p className="text-sm text-muted-foreground">{room}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Username</p>
                                        <p className="text-sm text-muted-foreground">{username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                                    <Server className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Server</p>
                                        <p className="text-xs text-muted-foreground break-all">
                                            {process.env.NEXT_PUBLIC_LIVEKIT_URL}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Token */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Access Token
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={token}
                                        readOnly
                                        rows={6}
                                        className="flex min-h-[60px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-none pr-12"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2"
                                        onClick={() => copyToClipboard(token, 'Token')}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Server URL */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Server URL
                                </label>
                                <div className="relative">
                                    <input
                                        value={process.env.NEXT_PUBLIC_LIVEKIT_URL || ''}
                                        readOnly
                                        className="flex h-9 w-full rounded-md border border-input bg-muted/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono pr-12"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-0 right-0 h-9"
                                        onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_LIVEKIT_URL || '', 'Server URL')}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>                            {/* Usage Instructions */}
                            <Alert>
                                <AlertDescription>
                                    <div className="space-y-2">
                                        <h4 className="font-medium">How to use this token:</h4>
                                        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                                            <li>Use this token to authenticate with LiveKit</li>
                                            <li>The token grants access to room "{room}" for user "{username}"</li>
                                            <li>Token includes permissions to publish and subscribe to streams</li>
                                            <li><strong>Token expires in 24 hours</strong> - generate a new one if needed</li>
                                            <li>Keep this token secure and don't share it publicly</li>
                                        </ul>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
