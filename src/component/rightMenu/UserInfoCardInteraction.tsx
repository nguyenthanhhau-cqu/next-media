'use client'
import React, {useState, useOptimistic} from 'react';
import {switchFollow} from "@/lib/action";

const UserInfoCardInteraction = ({
    userId,
    isFollowing,
    isFollowingSent
  }: {
    userId: string;
    currentUserId: string | null;
    isFollowingSent: boolean;
    isFollowing: boolean;
}) => {

    const [userState, setUserState] = useState({
        following:isFollowing,
        followingRequestSent:isFollowingSent
    })

    const follow = async () => {
        setOptimisticFollow("")
        try {
            await switchFollow(userId)
            setUserState(prev => ({
                ...prev,
                following:prev.following && false,
                followingRequestSent: !prev.following && !prev.followingRequestSent
            }))

        }catch (error) {
            console.error(error);
        }
    }

    const [optimisticFollow, setOptimisticFollow] = useOptimistic(
        userState,(state)=> ({
            ...state,
            following:state.following && false,
            followingRequestSent: !state.following && !state.followingRequestSent
        })
    )


    return (
        <>
            <form action={follow}>
                <button className={'w-full bg-blue-500 text-white text-sm rounded-md p-2'}>
                    {optimisticFollow.following  ? "Following" : optimisticFollow.followingRequestSent ? "Friend Request Sent" : "Follow" }
                </button>
            </form>
        </>
    );
};

export default UserInfoCardInteraction;