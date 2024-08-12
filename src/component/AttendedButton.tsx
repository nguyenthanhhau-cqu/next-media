'use client'

import React, {useState, useEffect, useCallback} from 'react';
import {useUser} from '@clerk/nextjs';
import {useRouter} from "next/navigation";

interface AttendedButtonProps {
    postId: number;
    pitchLocation: { lat: number; lng: number };
    userId: string | null;
    hasLiked: boolean;

}

const AttendedButton: React.FC<AttendedButtonProps> = ({postId, pitchLocation, userId, hasLiked}) => {
    const [isNearPitch, setIsNearPitch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasAttended, setHasAttended] = useState(false);
    const {user} = useUser();
    const router = useRouter();

    const ALLOWED_DISTANCE = 20000; // meters

    const checkLocation = useCallback(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(position)
                    const distance = calculateDistance(
                        position.coords.latitude,
                        position.coords.longitude,
                        pitchLocation.lat,
                        pitchLocation.lng
                    );
                    setIsNearPitch(distance <= ALLOWED_DISTANCE);
                    console.log(distance)
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

    useEffect(() => {
        const checkUserAttendance = async () => {
            if (userId) {
                try {
                    const response = await fetch('/api/attendance', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({postId, userId, action: 'check'}),
                    });
                    const data = await response.json();
                    setHasAttended(data.attended);
                } catch (error) {
                    console.error('Error checking attendance:', error);
                }
            }
        };

        checkUserAttendance();
    }, [userId, postId]);

    const handleAttend = async () => {
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
            }
            router.push('/attended');

        } catch (error) {
            console.error('Error recording attendance:', error);
            setError('Failed to record attendance. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Haversine formula to calculate distance between two points on Earth
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

    if (!hasLiked) {
        return null; // Don't render anything if the user hasn't liked the post
    }

    return (
        <div>
            <button
                onClick={handleAttend}
                disabled={!isNearPitch || isLoading || hasAttended}
                className={`px-4 py-2 rounded ${
                    hasAttended
                        ? 'bg-gray-500 cursor-not-allowed'
                        : isNearPitch
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-300'
                } text-white`}
            >
                {isLoading ? 'Recording...' : hasAttended ? 'Attended' : 'Attend'}
            </button>
            {
                !hasAttended && <>
                    <button onClick={checkLocation} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">
                        Refresh Location
                    </button>
                    <p className="mt-2">
                        {isNearPitch ? 'You are near the pitch!' : 'You are not near the pitch yet.'}
                    </p>
                </>
            }

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {hasAttended && <p className="text-green-500 mt-2">Thanks for attended</p>}
        </div>
    );
};

export default AttendedButton;