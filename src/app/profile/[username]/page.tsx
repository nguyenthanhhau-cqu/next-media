import React from 'react';
import ProfileFeed from "@/component/feed/ProfileFeed";
import RightMenu from "@/component/rightMenu/RightMenu";
import Image from "next/image";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const ProfilePage = async ({ params }: { params: { username: string } }) => {
    const username = params.username

    const user = await prisma.user.findFirst({
        where: { username },
        include: {
            _count: {
                select: {
                    followers: true,
                    followings: true,
                    posts: true,
                }
            }
        }
    });

    if (!user) {
        return notFound();
    }

    const { userId: currentUserId } = auth()

    if (!currentUserId) return notFound();

    return (
        <div className='flex gap-6 pt-6'>
            <div className="hidden xl:block w-[20%]"></div>
            <div className="w-full lg:w-[70%] xl:w-[50%]">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center justify-center">
                        <div className={'w-full h-64 relative'}>
                            <Image src={user.cover && user.cover !== "/noCover.png" && user.cover.startsWith("http")
                                ? user.cover
                                : "/noCover.png"}
                                   alt={'/'} fill className={' rounded-md object-cover'}/>
                            <Image src={user?.avatar || "/noAvatar.png"} alt={'/'} width={128} height={128}
                                   className={'w-32 h-32 absolute ring-4 ring-white -bottom-16 m-auto left-0 right-0 rounded-full'}/>
                        </div>
                    </div>
                    <RightMenu user={user}/>
                    <ProfileFeed />
                </div>
            </div>
            <div className="hidden lg:block w-[30%]"></div>
        </div>
    );
};

export default ProfilePage;