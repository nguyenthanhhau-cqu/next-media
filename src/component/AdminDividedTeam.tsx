"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { divideTeams, deleteTeamDisplay } from "@/lib/action";

interface AdminDividedTeamProps {
    postId: number;
    isAdmin: boolean;
}

const AdminDividedTeam: React.FC<AdminDividedTeamProps> = ({ postId, isAdmin }) => {
    const router = useRouter();

    if (!isAdmin) return null;

    const handleDivideTeams = async () => {
        try {
            await divideTeams(postId);
            router.push('/team');
        } catch (error) {
            console.error('Failed to divide teams:', error);
            // You might want to show an error message to the user here
        }
    };

    const handleDeleteTeamDisplay = async () => {
        try {
            await deleteTeamDisplay();
            // Optionally, you can add some feedback here, like a toast notification
        } catch (error) {
            console.error('Failed to delete team display:', error);
            // You might want to show an error message to the user here
        }
    };

    return (
        <div className="flex gap-4 mt-4">
            <button
                onClick={handleDivideTeams}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
                Divide Teams
            </button>
            <button
                onClick={handleDeleteTeamDisplay}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
                Done
            </button>
        </div>
    );
};

export default AdminDividedTeam;