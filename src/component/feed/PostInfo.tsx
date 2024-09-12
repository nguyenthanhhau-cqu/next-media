"use client";

import Image from "next/image";
import { useState } from "react";
import { deletePost } from "@/lib/action";
import AdminLikeControl from "@/component/AdminControl/AdminLikeControl";
import AdminControlsWrapper from "@/component/AdminControl/AdminControlsWrapper";
import AdminDividedTeam from "@/component/AdminControl/AdminDividedTeam";
import EditPostDialog from "@/component/EditPostDialog";

type PostInfoProps = {
    postId: number;
    isAdmin: boolean;
    initialIsLikeDisabled: boolean;
    post: {
        id: number;
        title: string | null;
        desc: string;
        eventStartTime: Date | null;
        penaltyAmount: number | null;
    };
};

const PostInfo = ({ postId, isAdmin, initialIsLikeDisabled, post }: PostInfoProps) => {
    const [open, setOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const deletePostWithId = deletePost.bind(null, postId);

    return (
        <div className="relative">
            <Image
                src="/more.png"
                width={16}
                height={16}
                alt=""
                onClick={() => setOpen((prev) => !prev)}
                className="cursor-pointer"
            />
            {open && (
                <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
                    {isAdmin && (
                        <>
                            <AdminLikeControl postId={postId} initialIsLikeDisabled={initialIsLikeDisabled} />
                            <AdminControlsWrapper postId={postId} />
                            <AdminDividedTeam postId={postId} isAdmin={isAdmin} />
                        </>
                    )}
                    <button
                        onClick={() => setIsEditDialogOpen(true)}
                        className="cursor-pointer text-left w-full"
                    >
                        Edit Post
                    </button>
                    <form action={deletePostWithId}>
                        <button className="text-red-500 cursor-pointer text-left w-full">Delete Post</button>
                    </form>
                </div>
            )}
            <EditPostDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                post={post}
            />
        </div>
    );
};

export default PostInfo;