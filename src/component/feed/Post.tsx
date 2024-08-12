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
import AttendedButton from "@/component/AttendedButton";
import AdminLikeControl from "@/component/AdminLikeControl";
import {formatInTimeZone} from "date-fns-tz";



type FeedPostType = PostType & {
    user: User;
    likes: (Like & { user: User })[]; // Update this line
    _count: { comments: number };
};

const Post = ({ post }: { post: FeedPostType }) => {
    const { userId } = auth();
    const isAdmin = userId === 'user_2kMGhFcDdkVuPB725T7KUPNXuJC';

    const pitchLocation = { lat:-37.8117104, lng:144.9722086 };

    const hasLiked = post.likes.some(like => like.userId === userId);

    const formattedEventTime = post.eventStartTime
        ? formatInTimeZone(new Date(post.eventStartTime), 'Australia/Melbourne', "yyyy-MM-dd HH:mm:ss")
        : null;

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
            {/* TITLE */}
            {post.title && (
                <h2 className="text-xl font-semibold">{post.title}</h2>
            )}
            {/* IMAGE */}
            {post.img && (
                <div className="w-full min-h-96 relative">
                    <Image
                        src={post.img}
                        fill
                        className="object-cover rounded-md"
                        alt={post.title || ""}
                    />
                </div>
            )}
            {/* DESCRIPTION */}
            <p>{post.desc}</p>
            {formattedEventTime && (
                <p className="text-sm text-gray-500">
                    Event starts at: {formattedEventTime}
                </p>
            )}

            {isAdmin && (
                <AdminLikeControl postId={post.id} initialIsLikeDisabled={post.isLikeDisabled} />
            )}
            {/* INTERACTION */}
            <Suspense fallback="Loading...">
                <PostInteraction
                    postId={post.id}
                    likes={post.likes}
                    commentNumber={post._count.comments}
                    isLikeDisabled={post.isLikeDisabled}

                />
                <AdminControlsWrapper
                    postId={post.id}
                />
                <AdminDividedTeam postId={post.id} isAdmin={isAdmin} />
            </Suspense>
            {hasLiked && (
                <AttendedButton
                    postId={post.id}
                    pitchLocation={pitchLocation}
                    userId={userId}
                    hasLiked={hasLiked}
                />
            )}
            <Suspense fallback="Loading...">
                <Comments postId={post.id} />
            </Suspense>
        </div>
    );
};

export default Post;