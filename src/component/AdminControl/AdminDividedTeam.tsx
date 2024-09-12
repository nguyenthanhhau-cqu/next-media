"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { divideTeams, deleteTeamDisplay } from "@/lib/action";

interface AdminDividedTeamProps {
    postId: number;
    isAdmin: boolean;
}

const AdminDividedTeam: React.FC<AdminDividedTeamProps> = ({ postId, isAdmin }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    if (!isAdmin) return null;

    const handleDivideTeams = async () => {
        setIsLoading(true);
        try {
            await divideTeams(postId);
            router.push('/team');
        } catch (error) {
            console.error('Failed to divide teams:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTeamDisplay = async () => {
        setIsLoading(true);
        try {
            await deleteTeamDisplay();
            // Optionally, you can add some feedback here, like a toast notification
        } catch (error) {
            console.error('Failed to delete team display:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <span
                onClick={handleDivideTeams}
                className={`cursor-pointer ${isLoading ? 'text-gray-400' : 'text-blue-500'}`}
            >
                {isLoading ? 'Processing...' : 'Divide Team'}
            </span>
            <span
                onClick={handleDeleteTeamDisplay}
                className={`cursor-pointer ${isLoading ? 'text-gray-400' : 'text-red-500'}`}
            >
                {isLoading ? 'Processing...' : 'Delete Team'}
            </span>
        </>
    );
};

export default AdminDividedTeam;