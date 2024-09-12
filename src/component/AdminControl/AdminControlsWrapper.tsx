'use client';

import { useState } from 'react';
import AdminControls from "./AdminControls";
import { triggerEvent, cancelEvent } from "@/lib/action";

interface AdminControlsWrapperProps {
    postId: number;
    isTriggered?: boolean;
    isCancelled?: boolean;
}

const AdminControlsWrapper: React.FC<AdminControlsWrapperProps> = ({ postId, isTriggered, isCancelled }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleTriggerEvent = async () => {
        setIsLoading(true);
        try {
            await triggerEvent(postId);
        } catch (error) {
            console.error('Failed to trigger event:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEvent = async () => {
        setIsLoading(true);
        try {
            await cancelEvent(postId);
        } catch (error) {
            console.error('Failed to cancel event:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminControls
            postId={postId}
            onTriggerEvent={handleTriggerEvent}
            onCancelEvent={handleCancelEvent}
            isLoading={isLoading}
        />
    );
};

export default AdminControlsWrapper;