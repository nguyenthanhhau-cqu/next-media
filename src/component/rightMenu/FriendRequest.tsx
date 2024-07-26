import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import FriendRequestList from "@/component/rightMenu/FriendRequestList";

const FriendRequest = async () => {


    const {userId} = auth()

    if(!userId) return null;

    const request = await prisma.followRequest.findMany({
        where: {
            receiverId: userId
        },
        include :{
            sender:true
        }
    })

    if(request.length === 0 ) return null;

    return (
        <div className={'p-4 bg-white  shadow-md rounded-lg text-sm flex flex-col gap-4'}>
            {/*TOP*/}
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-500">Friend Request</span>
                <Link href={'/'}  className={'text-blue-500 text-xs'}>See all</Link>
            </div>
            {/*User */}
            <FriendRequestList requests={request} />
        </div>
    );
};

export default FriendRequest;