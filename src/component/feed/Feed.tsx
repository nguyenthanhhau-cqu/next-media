import { auth } from "@clerk/nextjs/server";
import Post from "./Post";
import prisma from "@/lib/client";

const Feed = async ({ username }: { username?: string }) => {
    const { userId } = auth();

    let posts: any[] = [];

    if (username) {
        // Fetch posts for a specific user (no change needed here)
        posts = await prisma.post.findMany({
            where: {
                user: {
                    username: username,
                },
            },
            include: {
                user: true,
                likes: {
                    select: {
                        userId: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } else {
        // Fetch all posts regardless of following status
        posts = await prisma.post.findMany({
            include: {
                user: true,
                likes: {
                    select: {
                        userId: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    return (
        <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12">
            {posts.length ? (
                posts.map((post) => <Post key={post.id} post={post} />)
            ) : (
                "No posts found!"
            )}
        </div>
    );
};

export default Feed;