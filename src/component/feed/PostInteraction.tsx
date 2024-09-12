"use client";

import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import React, { useOptimistic, useState, useEffect } from "react";
import { switchLike } from "@/lib/action";
import Link from "next/link";
import { useRouter } from 'next/navigation';


type User = {
    id: string;
    username: string;
    avatar: string | null;
    cover: string | null;
    name: string | null;
    surname: string | null;
    description: string | null;
    city: string | null;
    school: string | null;
    work: string | null;
    createdAt: Date;
};

type LikeState = {
    likeCount: number;
    isLiked: boolean;
    likedUsers: User[];
};

type PostInteractionProps = {
    postId: number;
    likes: { user: User }[];
    isLikeDisabled: boolean;

};

const PostInteraction: React.FC<PostInteractionProps> = ({
                                                             postId,
                                                             likes,
                                                             isLikeDisabled,

                                                         }) => {
    const router = useRouter();

    const {  userId } = useAuth();

    const [likeState, setLikeState] = useState<LikeState>({
        likeCount: likes.length,
        isLiked: userId ? likes.some(like => like.user.id === userId) : false,
        likedUsers: likes.map(like => like.user),
    });

    const [optimisticLike, switchOptimisticLike] = useOptimistic<LikeState, string>(
        likeState,
        (state, _) => ({
            likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
            isLiked: !state.isLiked,
            likedUsers: state.isLiked
                ? state.likedUsers.filter(user => user.id !== userId)
                : userId
                    ? [...state.likedUsers, state.likedUsers.find(user => user.id === userId) || { id: userId } as User]
                    : state.likedUsers,
        })
    );

    useEffect(() => {
        setLikeState({
            likeCount: likes.length,
            isLiked: userId ? likes.some(like => like.user.id === userId) : false,
            likedUsers: likes.map(like => like.user),
        });
    }, [likes, userId]);


    const likeAction = async () => {
        if (!userId || isLikeDisabled) return;

        if (!userId) return;

        try {
            const user = await switchLike(postId);
            setLikeState((state) => ({
                likeCount: user ? state.likeCount + 1 : state.likeCount - 1,
                isLiked: !!user,
                likedUsers: user
                    ? [...state.likedUsers, user]
                    : state.likedUsers.filter((u) => u.id !== userId),
            }));

            // Refresh the page
            router.refresh();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between text-sm my-4">
                <div className="flex gap-8">
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                        <form action={likeAction}>
                            <button disabled={isLikeDisabled}>
                                <Image
                                    src={optimisticLike.isLiked ? "/liked.png" : "/like.png"}
                                    width={16}
                                    height={16}
                                    alt=""
                                    className={`cursor-pointer ${isLikeDisabled ? 'opacity-50' : ''}`}
                                />
                            </button>
                        </form>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">
                            {optimisticLike.likeCount}
                            <span className="hidden md:inline"> Likes</span>
                        </span>



                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                        <Image
                            src="/comment.png"
                            width={16}
                            height={16}
                            alt=""
                            className="cursor-pointer"
                        />
                        <span className="text-gray-300">|</span>
                    </div>
                </div>
                <div className="">
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                        <Image
                            src="/share.png"
                            width={16}
                            height={16}
                            alt=""
                            className="cursor-pointer"
                        />
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">
                            <span className="hidden md:inline"> Share</span>
                        </span>
                    </div>
                </div>
            </div>
            {optimisticLike.likedUsers.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold mb-2">Liked by:</h4>
                    <ul className="space-y-2">
                        {optimisticLike.likedUsers.map((user) => (
                            <li key={user.id}>
                                <Link className=" cursor-pointer flex items-center space-x-2"
                                      href={`/profile/${user.username}`}><Image
                                    src={user.avatar || "/noAvatar.png"}
                                    width={24}
                                    height={24}
                                    alt=""
                                    className="rounded-full"
                                />
                                    <span>{user.name || user.username} {user.surname}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PostInteraction;