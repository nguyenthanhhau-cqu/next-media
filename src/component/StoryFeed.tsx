// app/components/StoryFeed.tsx
'use client'

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

interface Story {
    username: string;
    imageUrl: string;
}

export default function StoryFeed() {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
    const [showRightButton, setShowRightButton] = useState<boolean>(true);

    const stories: Story[] = [
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
        { username: 'hoangmilo_', imageUrl: '/dog.png' },
    ];

    const checkScrollButtons = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setShowLeftButton(container.scrollLeft > 0);
            setShowRightButton(
                container.scrollLeft < container.scrollWidth - container.clientWidth
            );
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtons);
            checkScrollButtons();
        }
        return () => container?.removeEventListener('scroll', checkScrollButtons);
    }, []);

    const scroll = (direction: 'left' | 'right'): void => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 relative">
            <div
                ref={scrollContainerRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide"
            >
                {stories.map((story, index) => (
                    <div key={index} className="flex flex-col items-center space-y-1 flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 p-[3px]">
                            <Image
                                src={story.imageUrl}
                                alt={story.username}
                                width={64}
                                height={64}
                                className="rounded-full"
                            />
                        </div>
                        <span className="text-xs">{story.username}</span>
                    </div>
                ))}
            </div>
            {showLeftButton && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                >
                    <span className="text-gray-800">&lt;</span>
                </button>
            )}
            {showRightButton && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                >
                    <span className="text-gray-800">&gt;</span>
                </button>
            )}
        </div>
    );
}