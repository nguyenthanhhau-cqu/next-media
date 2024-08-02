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

    if (user?.id !== 'user_2jlzdF9Zpb1sTsBa0W8rOHronjU') {
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
        <div className="mt-4 flex space-x-4">
            <button
                onClick={handleTriggerEvent}
                className="bg-green-500 text-white px-4 py-2 rounded"
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Trigger Event'}
            </button>
            <button
                onClick={handleCancelEvent}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Cancel Event'}
            </button>
        </div>
    );
};

export default AdminControls;