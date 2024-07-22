import React from 'react';
import Link from "next/link";
import Image from "next/image";

const FriendRequest = () => {
    return (
        <div className={'p-4 bg-white  shadow-md rounded-lg text-sm flex flex-col gap-4'}>
            {/*TOP*/}
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-500">Friend Request</span>
                <Link href={'/'}  className={'text-blue-500 text-xs'}>See all</Link>
            </div>
            {/*User */}
            <div className={'flex items-center justify-between'}>
                <div className={'flex items-center gap-4'}>
                    <Image src={'/dog.png'} alt={''} width={40} height={40} className={'w-10 h-10 rounded-full'}/>
                    <span className={'font-semibold'}>Hau</span>
                </div>
                <div className={'flex gap-3'}>
                    <Image src={'/accept.png'} alt={''} width={20} height={20} className={'cursor-pointer'}/>
                    <Image src={'/reject.png'} alt={''} width={20} height={20} className={'cursor-pointer'}/>
                </div>
            </div>
            {/*User */}
            <div className={'flex items-center justify-between'}>
                <div className={'flex items-center gap-4'}>
                    <Image src={'/dog.png'} alt={''} width={40} height={40} className={'w-10 h-10 rounded-full'}/>
                    <span className={'font-semibold'}>Bac lam</span>
                </div>
                <div className={'flex gap-3'}>
                    <Image src={'/accept.png'} alt={''} width={20} height={20} className={'cursor-pointer'}/>
                    <Image src={'/reject.png'} alt={''} width={20} height={20} className={'cursor-pointer'}/>
                </div>
            </div>
            {/*User */}
            <div className={'flex items-center justify-between'}>
                <div className={'flex items-center gap-4'}>
                    <Image src={'/dog.png'} alt={''} width={40} height={40} className={'w-10 h-10 rounded-full'}/>
                    <span className={'font-semibold'}>Jackie Tinh</span>
                </div>
                <div className={'flex gap-3'}>
                    <Image src={'/accept.png'} alt={''} width={20} height={20} className={'cursor-pointer'}/>
                    <Image src={'/reject.png'} alt={''} width={20} height={20} className={'cursor-pointer'}/>
                </div>
            </div>

        </div>
    );
};

export default FriendRequest;