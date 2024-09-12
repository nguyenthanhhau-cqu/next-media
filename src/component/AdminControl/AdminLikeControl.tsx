'use client'

import { useState } from 'react';
import { toggleLikeButton } from "@/lib/action";

interface AdminLikeControlsProps {
    postId: number;
    initialIsLikeDisabled: boolean;
}

export default function AdminLikeControl({ postId, initialIsLikeDisabled }: AdminLikeControlsProps) {
    const [isLikeDisabled, setIsLikeDisabled] = useState(initialIsLikeDisabled);

    const handleToggle = async () => {
        try {
            const result = await toggleLikeButton(postId);
            if (result.success) {
                setIsLikeDisabled(!isLikeDisabled);
            } else {
                console.error('Failed to toggle like button');
            }
        } catch (error) {
            console.error('Error toggling like button:', error);
        }
    };

    return (
        <span
            onClick={handleToggle}
            className={`cursor-pointer ${
                isLikeDisabled ? 'text-green-500' : 'text-red-500'
            }`}
        >
            {isLikeDisabled ? 'Enable' : 'Disable'} Likes
        </span>
    );
}