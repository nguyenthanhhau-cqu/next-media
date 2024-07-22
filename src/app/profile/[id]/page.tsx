import React from 'react';
import Feed from "@/component/Feed";
import RightMenu from "@/component/RightMenu";
import Image from "next/image";

const ProfilePage = () => {
    return (
        <div className='flex gap-6 pt-6'>
            <div className="hidden xl:block w-[20%]"></div>
            <div className="w-full lg:w-[70%] xl:w-[50%]">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center justify-center">
                        <div className={'w-full h-64 relative'}>
                            <Image src={'/dog.png'} alt={'/'} fill className={' rounded-md object-cover'}  />
                            <Image src={'/dog.png'} alt={'/'} width={128} height={128} className={'w-32 h-32 absolute ring-4 ring-white -bottom-16 m-auto left-0 right-0 rounded-full'}  />
                        </div>
                    </div>
                    <RightMenu userId={'test'}/>
                    <Feed/>
                </div>
            </div>
            <div className="hidden lg:block w-[30%]"></div>
        </div>
    );
};

export default ProfilePage;