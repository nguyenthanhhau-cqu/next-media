import React from 'react';
import Link from "next/link";
import MobileMenu from "@/component/MobileMenu";

const NavBar = () => {
    return (
        <div className={'h-24 flex items-center justify-between'}>
            <div className={''}>
                    <Link className={'font-bold text-xl text-blue-600'} href={'/'}> HauF </Link>
            </div>
            <div className={'hidden'}>
            </div>
            <div className={''}>
                    <MobileMenu />
            </div>
        </div>
    );
};

export default NavBar;