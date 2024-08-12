import {auth} from "@clerk/nextjs/server";
import Post from "./Post";
import prisma from "@/lib/client";

const Feed = async ({username}: { username?: string }) => {
    const {userId} = auth();


    const posts: any = await prisma.post.findMany({
        where: username ? {user: {username}} : {},
        include: {
            user: true,
            likes: {
                include: {
                    user: true,
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
    return (
        <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12">
            {posts.length ? (
                posts.map((post:any) => <Post key={post.id} post={post}/>)) : (
                "Have Fun"
            )}
        </div>
    );
};

export default Feed;