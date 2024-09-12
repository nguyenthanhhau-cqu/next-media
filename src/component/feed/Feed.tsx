import { auth } from "@clerk/nextjs/server";
import Post from "./Post";
import prisma from "@/lib/client";

const Feed = async ({ username }: { username?: string }) => {
    const { userId } = auth();

    const posts: any = await prisma.post.findMany({
        where: username ? { user: { username } } : {},
        include: {
            user: true,
            likes: {
                include: {
                    user: true,
                },
            },
        },
        orderBy: {
            eventStartTime: "desc", // Order by event start time
        },
    });

    const currentTime = new Date();

    // Separate posts into upcoming and past events
    const upcomingEvents = posts.filter((post: any) =>
        post.eventStartTime && new Date(post.eventStartTime) > currentTime
    );

    const pastEvents = posts.filter((post: any) =>
        !post.eventStartTime || new Date(post.eventStartTime) <= currentTime
    );

    return (
        <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-6">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            {upcomingEvents.length ? (
                upcomingEvents.map((post: any) => <Post key={post.id} post={post} />)
            ) : (
                <p>No upcoming events</p>
            )}

            <h3 className="text-lg font-semibold">Past Events</h3>
            {pastEvents.length ? (
                pastEvents.map((post: any) => <Post key={post.id} post={post} />)
            ) : (
                <p>No past events</p>
            )}
        </div>
    );
};

export default Feed;