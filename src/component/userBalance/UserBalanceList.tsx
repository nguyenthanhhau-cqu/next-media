'use client'
import { useState } from 'react';
import UserBalanceItem from "./UserBalanceItem";

type User = {
    id: string;
    username: string;
    name: string | null;
    surname: string | null;
    avatar: string | null;
    balance: number;
};

type Props = {
    initialUsers: User[];
    isAdmin: boolean;
};

export default function UserBalanceList({ initialUsers, isAdmin }: Props) {
    const [users, setUsers] = useState(initialUsers);

    const handleUpdate = (userId: string, newBalance: number) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, balance: newBalance } : user
            )
        );
    };

    return (
        <div className="space-y-4">
            {users.map((user) => (
                <UserBalanceItem
                    key={user.id}
                    user={user}
                    isAdmin={isAdmin}
                    onUpdate={handleUpdate}
                />
            ))}
        </div>
    );
}