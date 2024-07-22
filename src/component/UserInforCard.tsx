import React from 'react';
import Link from "next/link";
import Image from "next/image";

const UserInforCard = ({userId}:{userId?:string}) => {
    return (
        <div className={'p-4 bg-white  shadow-md rounded-lg text-sm flex flex-col gap-4'}>
            {/*TOP*/}
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-500">User Information</span>
                <Link href={'/'}  className={'text-blue-500 text-xs'}>See all</Link>
            </div>
            <div className="flex flex-col gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                    <span className={'text-xl text-black'}>Thanh Hau</span>
                    <span className={'text-sm'}>@Nguyen</span>
                </div>
                <div className="flex justify-center gap-4">
                    <div className={'flex gap-2'}>
                        <span className={'font-medium font- text-black'}>1.2K</span>
                        <span className={'font-sm'}>Follower</span>
                    </div>
                    <div className={'flex gap-2'}>
                        <span className={'font-medium text-black'}>1.2K</span>
                        <span className={'font-sm'}>Following</span>
                    </div>
                </div>

                <p>LOREM LOREM LOREM LOREM LOREM LOREM</p>
                <div className="flex items-center gap-2">
                    <Image src={'/map.png'} alt={''} width={16} height={16} className={'cursor-pointer'}/>
                    <span>Living <b>Melbourne</b></span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={'/school.png'} alt={''} width={16} height={16} className={'cursor-pointer'}/>
                    <span>Went to CQU University</span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={'/work.png'} alt={''} width={16} height={16} className={'cursor-pointer'}/>
                    <span>Work At <b>Pineapple</b></span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={'/date.png'} alt={''} width={16} height={16} className={'cursor-pointer'}/>
                    <span>Join 23/07/2024</span>
                </div>
                <button className={'bg-blue-500 text-white rounded-md text-sm p-2'}>Follow</button>
            </div>
        </div>
    );
};

export default UserInforCard;