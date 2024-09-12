import { auth } from "@clerk/nextjs/server";
import Post from "./Post";
import prisma from "@/lib/client";

const ProfileFeed = async () => {
    const { userId } = auth();
    const currentTime = new Date();

    const upcomingEvents = await prisma.post.findMany({
        where: {
            eventStartTime: { gt: currentTime }
        },
        include: {
            user: true,
            likes: {
                include: {
                    user: true,
                },
            },
        },
        orderBy: {
            eventStartTime: "desc",
        },
    });

    return (
        <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-6">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            {upcomingEvents.length ? (
                upcomingEvents.map((post) => <Post key={post.id} post={post} />)
            ) : (
                <p>No upcoming events</p>
            )}
        </div>
    );
};

export default ProfileFeed;