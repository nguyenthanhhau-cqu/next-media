'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Users, User } from 'lucide-react';
import {useUser} from "@clerk/nextjs";

const BottomNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoaded } = useUser();


    // Determine the profile link
    const profileLink = isLoaded && user ? `/profile/${user.username}` : '/profile';
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 md:hidden">
            <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className={pathname === '/' ? 'text-blue-600' : ''}
            >
                <Calendar size={24} />
            </Button>
            <Button
                variant="ghost"
                onClick={() => router.push('/attended')}
                className={pathname === '/attended' ? 'text-blue-600' : ''}
            >
                <CheckCircle size={24} />
            </Button>
            <Button
                variant="ghost"
                onClick={() => router.push('/team')}
                className={pathname === '/team' ? 'text-blue-600' : ''}
            >
                <Users size={24} />
            </Button>
            <Button
                variant="ghost"
                onClick={() => router.push(profileLink)}
                className={pathname === profileLink ? 'text-blue-600' : ''}
            >
                <User size={24} />
            </Button>
        </nav>
    );
};

export default BottomNavigation;