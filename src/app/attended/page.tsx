import React from 'react';
import { getAttendedPosts } from '@/lib/action';
import Image from 'next/image';
import { formatInTimeZone } from 'date-fns-tz';

const AttendedPage = async () => {
    const attendedPosts = await getAttendedPosts();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Attended</h1>
            {attendedPosts.map((post) => (
                <div key={post.id} className="mb-8 bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">{post.title}</h2>
                    <div className="space-y-4">
                        {post.attendances.map((attendance) => (
                            <div key={attendance.id} className="flex items-center space-x-4">
                                <Image
                                    src={attendance.user.avatar || "/noAvatar.png"}
                                    alt={attendance.user.username}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div>
                                    <span className="font-medium">{attendance.user.username}</span>
                                    <span className="text-gray-500 ml-2">
                                        attended on {formatInTimeZone(
                                        new Date(attendance.attendedAt),
                                        'Australia/Melbourne',
                                        'yyyy-MM-dd HH:mm:ss'
                                    )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttendedPage;