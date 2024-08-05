import Image from "next/image";
import Comments from "./Comments";
import { Post as PostType, User, Like } from "@prisma/client";
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import PostInfo from "./PostInfo";
import { auth } from "@clerk/nextjs/server";
import AdminControlsWrapper from "@/component/AdminControlsWrapper";
import AdminDividedTeam from "@/component/AdminDividedTeam";
import UserInfo from "@/component/feed/UserInfor";



type FeedPostType = PostType & {
    user: User;
    likes: (Like & { user: User })[]; // Update this line
    _count: { comments: number };
};

const Post = ({ post }: { post: FeedPostType }) => {
    const { userId } = auth();
    const isAdmin = userId === 'user_2kDaQgI2XRuouICyvx3L5l8K9AB';

    return (
        <div className="flex flex-col gap-4">
            {/* USER */}
            <div className="flex items-center justify-between">
                <UserInfo
                    userId={post.user.id}
                    username={post.user.username}
                    name={post.user.name}
                    surname={post.user.surname}
                    avatar={post.user.avatar}
                />
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
                <AdminDividedTeam postId={post.id} isAdmin={isAdmin} />
            </Suspense>
            <Suspense fallback="Loading...">
                <Comments postId={post.id} />
            </Suspense>
        </div>
    );
};

export default Post;