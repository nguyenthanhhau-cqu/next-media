"use client";

import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";

interface AdminControlsProps {
    postId: number;
    onTriggerEvent: () => Promise<void>;
    onCancelEvent: () => Promise<void>;
    isLoading: boolean;
}

const AdminControls: React.FC<AdminControlsProps> = ({ postId, onTriggerEvent, onCancelEvent}) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    if (user?.id !== 'user_2kyEFBJyLszkG66jjaEO3ryToc7') {
        return null;
    }

    const handleTriggerEvent = async () => {
        setIsLoading(true);
        try {
            await onTriggerEvent();
        } catch (error) {
            console.error('Failed to trigger event:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEvent = async () => {
        setIsLoading(true);
        try {
            await onCancelEvent();
        } catch (error) {
            console.error('Failed to cancel event:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <span
                onClick={handleTriggerEvent}
                className={`cursor-pointer ${isLoading ? 'text-gray-400' : 'text-green-500'}`}
            >
                {isLoading ? 'Processing...' : 'Send Email'}
            </span>
            <span
                onClick={handleCancelEvent}
                className={`cursor-pointer ${isLoading ? 'text-gray-400' : 'text-red-500'}`}
            >
                {isLoading ? 'Processing...' : 'Cancel Email'}
            </span>
        </>
    );
};

export default AdminControls;