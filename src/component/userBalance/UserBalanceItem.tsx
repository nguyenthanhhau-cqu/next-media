'use client'
import { useState } from 'react';
import Image from 'next/image';

type User = {
    id: string;
    username: string;
    name: string | null;
    surname: string | null;
    avatar: string | null;
    balance: number;
};

type Props = {
    user: User;
    isAdmin: boolean;
    onUpdate: (userId: string, newBalance: number) => void;
};

export default function UserBalanceItem({ user, isAdmin, onUpdate }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [newBalance, setNewBalance] = useState(user.balance.toString());

    const handleEdit = async () => {
        if (isEditing) {
            try {
                const response = await fetch('/api/updateBalance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id, newBalance }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update balance');
                }

                const updatedUser = await response.json();
                onUpdate(user.id, updatedUser.balance);
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating balance:', error);
            }
        } else {
            setIsEditing(true);
        }
    };

    return (
        <div className="flex items-center space-x-4 p-4 bg-white shadow rounded-lg">
            <Image
                src={user.avatar || "/noAvatar.png"}
                alt={user.username}
                width={50}
                height={50}
                className="rounded-full"
            />
            <div className="flex-grow">
                <p className="font-semibold">
                    {user.name && user.surname
                        ? `${user.name} ${user.surname}`
                        : user.username}
                </p>
            </div>
            <div className="flex items-center space-x-2">
                {isEditing ? (
                    <input
                        type="number"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        className="border rounded px-2 py-1 w-24"
                    />
                ) : (
                    <span className="font-semibold">${user.balance.toFixed(2)}</span>
                )}
                {isAdmin && (
                    <button onClick={handleEdit} className="text-blue-500">
                        {isEditing ? "Save" : "Edit"}
                    </button>
                )}
            </div>
        </div>
    );
}