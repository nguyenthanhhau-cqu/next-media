'use client'
import React from 'react';
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const MobileMenu = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { user, isLoaded } = useUser();

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    // Determine the profile link
    const profileLink = isLoaded && user ? `/profile/${user.username}` : '/profile';

    return (
        <div>
            <div className="flex flex-col gap-[4.5px] cursor-pointer md:hidden"
                 onClick={() => setIsOpen(prev => !prev)}>
                <div className={`w-6 h-1 bg-blue-500 rounded-sm ${isOpen ? "rotate-45":"" } origin-left ease-in-out duration-500` }/>
                <div className={`w-6 h-1 bg-blue-500 rounded-sm ${isOpen ? "opacity-0": ""} ease-in-out duration-500` }/>
                <div className={`w-6 h-1 bg-blue-500 rounded-sm ${isOpen ? "-rotate-45": ""} origin-left ease-in-out duration-500` }/>
            </div>
            {isOpen && (
                <div
                    className={'absolute left-0 top-24 w-full h-[calc(100vh-96px)] bg-white flex ' +
                        'flex-col items-center justify-center gap-6 font-medium text-xl z-10'}>
                    <Link href={'/'} onClick={handleLinkClick}>Home</Link>
                    <Link href={'/team'} onClick={handleLinkClick}>Team Division</Link>
                    <Link href={profileLink} onClick={handleLinkClick}>Profile</Link>
                    <Link href={'/attended'} onClick={handleLinkClick}>Attendance</Link>
                    <Link href={'/userBalance'} onClick={handleLinkClick}>Balance</Link>

                </div>
            )}
        </div>
    );
};

export default MobileMenu;