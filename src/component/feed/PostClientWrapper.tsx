'use client'

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { switchLike } from "@/lib/action";
import Image from "next/image";
import Link from "next/link";
import { User, Like } from "@prisma/client";
import { CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, RefreshCw } from 'lucide-react';
import { useRouter } from "next/navigation";

type PostClientWrapperProps = {
    postId: number;
    likes: (Like & { user: User })[];
    isLikeDisabled: boolean;
    userId: string | null;
    title: string | null;
    description: string;
    formattedEventTime: string | null;
    pitchLocation: { lat: number; lng: number };
};

const PostClientWrapper: React.FC<PostClientWrapperProps> = ({
                                                                 postId,
                                                                 likes,
                                                                 isLikeDisabled,
                                                                 userId,
                                                                 title,
                                                                 description,
                                                                 formattedEventTime,
                                                                 pitchLocation
                                                             }) => {
    const [isAttending, setIsAttending] = useState(likes.some(like => like.userId === userId));
    const [attendees, setAttendees] = useState(likes.map(like => like.user));
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isNearPitch, setIsNearPitch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasAttended, setHasAttended] = useState(false);
    const [needsRefresh, setNeedsRefresh] = useState(false);
    const router = useRouter();
    const eventSourceRef = useRef<EventSource | null>(null);

    const ALLOWED_DISTANCE = 3900; // meters

    const setupSSE = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const eventSource = new EventSource(`/api/events?postId=${postId}`);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'attendance_update') {
                setAttendees(data.attendees);
                setIsAttending(data.attendees.some((attendee: User) => attendee.id === userId));
                setNeedsRefresh(false);
            }
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
            setNeedsRefresh(true);
        };

        return () => {
            eventSource.close();
        };
    }, [postId, userId]);

    useEffect(() => {
        setupSSE();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setupSSE();
            } else {
                if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                }
                setNeedsRefresh(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [setupSSE]);

    const handleAttendClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!userId) return;

        try {
            setIsLoading(true);
            await switchLike(postId);
            // The real-time update will be handled by the SSE connection
        } catch (err) {
            console.error(err);
            setError('Failed to update attendance. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const checkLocation = useCallback(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const distance = calculateDistance(
                        position.coords.latitude,
                        position.coords.longitude,
                        pitchLocation.lat,
                        pitchLocation.lng
                    );
                    setIsNearPitch(distance <= ALLOWED_DISTANCE);
                    setError(null);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsNearPitch(false);
                    setError('Unable to get your location. Please ensure location services are enabled.');
                },
                {enableHighAccuracy: true, timeout: 5000, maximumAge: 0}
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setIsNearPitch(false);
        }
    }, [pitchLocation]);

    useEffect(() => {
        checkLocation();
        const intervalId = setInterval(checkLocation, 60000); // Check every minute
        return () => clearInterval(intervalId);
    }, [checkLocation]);

    const handleCheckIn = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!userId || !isNearPitch || isLoading || hasAttended) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId,
                    userId,
                    action: 'record',
                    timestamp: new Date().toISOString()
                }),
            });
            const data = await response.json();
            if (data.success) {
                setHasAttended(true);
                setError(null);
                router.push('/attended');
            } else {
                setError(data.error || 'Failed to record attendance. Please try again.');
            }
        } catch (error) {
            console.error('Error recording attendance:', error);
            setError('Failed to record attendance. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        setupSSE();
        router.refresh();
    };

    function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    return (
        <>
            <CardContent className={'mb-2'}>
                <h4 className="font-semibold">{title}</h4>
                <p><Calendar className="inline mr-2" size={16} />  Event starts at: {formattedEventTime}</p>
                <p><MapPin className="inline mr-2" size={16} /> {description}</p>
                <p className={'cursor-pointer'} onClick={() => setIsDialogOpen(true)}>
                    <Users className="inline mr-2" size={16} /> {attendees.length} attending
                </p>
                <div className="mt-2">
                    <Button
                        variant={isAttending ? "default" : "outline"}
                        className="w-full mb-2"
                        onClick={handleAttendClick}
                        disabled={isLikeDisabled || isLoading}
                    >
                        {isLoading ? "Updating..." : isAttending ? "Attending" : "Will Attend"}
                    </Button>
                    {isAttending && (
                        <Button
                            variant={hasAttended ? "default" : "outline"}
                            className="w-full mb-2"
                            onClick={handleCheckIn}
                            disabled={!isNearPitch || isLoading || hasAttended}
                        >
                            {isLoading ? 'Recording...' : hasAttended ? 'Attended' : 'Check-In'}
                        </Button>
                    )}
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {hasAttended && <p className="text-green-500 mt-2">Thanks for attending!</p>}
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Attendees</DialogTitle>
                    </DialogHeader>
                    {attendees.length > 0 ? (
                        <ul className="space-y-2">
                            {attendees.map((user) => (
                                <li key={user.id}>
                                    <Link className="cursor-pointer flex items-center space-x-2" href={`/profile/${user.username}`}>
                                        <Image
                                            src={user.avatar || "/noAvatar.png"}
                                            width={24}
                                            height={24}
                                            alt=""
                                            className="rounded-full"
                                        />
                                        <span>{user.name || user.username} {user.surname}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No one is attending yet.</p>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PostClientWrapper;