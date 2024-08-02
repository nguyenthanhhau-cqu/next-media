import Image from "next/image";
import Comments from "./Comments";
import { Post as PostType, User, Like } from "@prisma/client";
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import PostInfo from "./PostInfo";
import { auth } from "@clerk/nextjs/server";
import { triggerEvent, cancelEvent } from "@/lib/action";
import AdminControlsWrapper from "@/component/AdminControlsWrapper";



type FeedPostType = PostType & {
    user: User;
    likes: (Like & { user: User })[]; // Update this line
    _count: { comments: number };
};

const Post = ({ post }: { post: FeedPostType }) => {
    const { userId } = auth();


    const handleTriggerEvent = async () => {
        await triggerEvent(post.id);
    };

    const handleCancelEvent = async () => {
        await cancelEvent(post.id);
    };



    return (
        <div className="flex flex-col gap-4">
            {/* USER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image
                        src={post.user.avatar || "/noAvatar.png"}
                        width={40}
                        height={40}
                        alt=""
                        className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium">
                        {post.user.name && post.user.surname
                            ? post.user.name + " " + post.user.surname
                            : post.user.username}
                    </span>
                </div>
                {userId === post.user.id && <PostInfo postId={post.id} />}
            </div>
            {/* DESC */}
            <div className="flex flex-col gap-4">
                {post.img && (
                    <div className="w-full min-h-96 relative">
                        <Image
                            src={post.img}
                            fill
                            className="object-cover rounded-md"
                            alt=""
                        />
                    </div>
                )}
                <p>{post.desc}</p>
            </div>
            {/* INTERACTION */}
            <Suspense fallback="Loading...">
                <PostInteraction
                    postId={post.id}
                    likes={post.likes}
                    commentNumber={post._count.comments}
                />
                <AdminControlsWrapper
                    postId={post.id}
                />

            </Suspense>
            <Suspense fallback="Loading...">
                <Comments postId={post.id} />
            </Suspense>
        </div>
    );
};

export default Post;