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
        <button
            onClick={handleToggle}
            className={`px-4 py-2 rounded w-32 text-sm  ${
                isLikeDisabled ? 'bg-green-500' : 'bg-red-500'
            } text-white `}
        >
            {isLikeDisabled ? 'Enable' : 'Disable'} Likes
        </button>
    );
}