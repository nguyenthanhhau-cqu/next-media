import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {User} from "@prisma/client";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import UserInfoCardInteraction from "@/component/rightMenu/UserInfoCardInteraction";
import UpdateUser from "@/component/rightMenu/updateUser";


type UserWithCount = User & {
    _count?: {
        followers: number;
        followings: number;
        posts: number;
    }
};


const UserInforCard = async ({user}: { user?: UserWithCount }) => {

    if (!user) return null


    const createAtDate = new Date(user.createdAt)

    const formmatedDate = createAtDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    let isFollowing = false;
    let isFollowingSent = false;


    const {userId: currentUserId} = auth();

    if(currentUserId) {
        const followRes = await prisma.follower.findFirst({
            where:{
                followerId: currentUserId,
                followingId:user.id
            }
        })
        followRes ? (isFollowing = true) :(isFollowing = false);
    }

    if(currentUserId) {
        const followReqRes = await prisma.followRequest.findFirst({
            where: {
                senderId: currentUserId,
                receiverId: user.id
            }
        })
        followReqRes ? (isFollowingSent = true) : (isFollowingSent = false);
    }




    return (
        <div className={'p-4 bg-white  shadow-md rounded-lg text-sm flex flex-col gap-4'}>
            {/*TOP*/}
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-500">User Information</span>
                {currentUserId === user.id ? (<UpdateUser user={user} />) : (<Link href={'/'} className={'text-blue-500 text-xs'}>
                    See all
                </Link>)}

            </div>
            <div className="flex flex-col gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                    <span
                        className={'text-xl text-black'}>{(user?.name && user.username) ? user.name + "  " + user.surname : user?.username}</span>
                    <span className={'text-sm'}>@{user?.username}</span>
                </div>
                <div className="flex justify-center gap-4">
                    <div className={'flex gap-2'}>
                        <span className={'font-medium font- text-black'}>{user?._count?.followers || 0}</span>
                        <span className={'font-sm'}>Followers</span>
                    </div>
                    <div className={'flex gap-2'}>
                        <span className={'font-medium text-black'}>{user?._count?.followings || 0}</span>
                        <span className={'font-sm'}>Followings</span>
                    </div>
                </div>

                <p>{user?.description}</p>
                <div className="flex items-center gap-2">
                    <Image src={'/map.png'} alt={''} width={16} height={16} className={'cursor-pointer'}/>
                    <span>Living <b>{user?.city}</b></span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={'/school.png'} alt={''} width={16} height={16} className={'cursor-pointer'}/>
                    <span>Went to {user?.school}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={'/work.png'} alt={''} width={16} height={16} className={'cursor-pointer'}/>
                    <span>Work At <b>{user?.work}</b></span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={'/date.png'} alt={''} width={16} height={16} className={'cursor-pointer'}/>
                    <span>{formmatedDate}</span>
                </div>
                <UserInfoCardInteraction userId={user.id} currentUserId={currentUserId} isFollowing={isFollowing} isFollowingSent = {isFollowingSent}/>
            </div>
        </div>
    );
};

export default UserInforCard;