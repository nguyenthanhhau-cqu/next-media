import React from 'react';
import FriendRequest from "@/component/FriendRequest";
import BirthDay from "@/component/BirthDay";
import Ad from "@/component/Ad";
import UserInforCard from "@/component/UserInforCard";
import UserMediaCard from "@/component/UserMediaCard";

const RightMenu = ({userId}:{userId?:string}) => {
    return (
        <div className={'flex flex-col gap-6'}>

            {userId ? (
                <>
                    <UserInforCard userId={userId}  />
                </>
            ):null}


            <FriendRequest />
            {/*<BirthDay/>*/}
            {/*<Ad size={'md'}/>*/}
        </div>
    );
};

export default RightMenu;