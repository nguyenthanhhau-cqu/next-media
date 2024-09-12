import React, {Suspense} from 'react';
import FriendRequest from "@/component/rightMenu/FriendRequest";
import UserInforCard from "@/component/rightMenu/UserInforCard";
import {User} from "@prisma/client";

const RightMenu = ({user}:{user?:User}) => {

    return (
        <div className={'flex flex-col gap-6'}>

            {user ? (
                <>
                    <Suspense fallback={'loading....'}>
                        <UserInforCard user={user}  />
                    </Suspense>
                </>
            ):null}
            <FriendRequest />
        </div>
    );
};

export default RightMenu;