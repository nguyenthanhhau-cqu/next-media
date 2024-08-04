'use client'

import Link from "next/link";
import Image from "next/image";

type UserInfoProps = {
    userId: string;
    username: string;
    name: string | null;
    surname: string | null;
    avatar: string | null;
}

const UserInfo = ({ userId, username, name, surname, avatar }: UserInfoProps) => {
    return (
        <Link href={`/profile/${username}`} className="flex items-center gap-4">
            <Image
                src={avatar || "/noAvatar.png"}
                width={40}
                height={40}
                alt=""
                className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">
                {name && surname
                    ? `${name} ${surname}`
                    : username}
            </span>
        </Link>
    );
}

export default UserInfo;