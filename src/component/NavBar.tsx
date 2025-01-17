import React from 'react';
import Link from "next/link";
import MobileMenu from "@/component/MobileMenu";
import Image from "next/image";
import {ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton} from "@clerk/nextjs";

const NavBar = () => {
    return (
        <div className={'h-24 flex items-center justify-between'}>
            <div className={'md:hidden lg:block w-[20%]'}>
                <Link className={'font-bold text-xl text-blue-500'} href={'/'}>My-FC</Link>
            </div>
            <div className={'hidden  md:flex md:justify-center md:items-center w-[50%] text-sm'}>
                <div className="flex gap-6 text-gray-600 ">
                    <Link className={'flex items-center  gap-2'} href={'/'}><Image src={'/home.png'} alt="Home Image" width={16}
                                                                     height={16} className={'w-4 h-4'}/>
                        <span>Homepage</span>
                    </Link>

                    <Link className={'flex items-center gap-2'} href={'/'}><Image src={'/friends.png'} alt="Home Image" width={16}
                                                                     height={16} className={'w-4 h-4'}/>
                        <span>Friends</span>
                    </Link>

                    <Link className={'flex items-center gap-2'} href={'/'}><Image src={'/stories.png'} alt="Home Image" width={16}
                                                                     height={16} className={'w-4 h-4'}/>
                        <span>Stories</span>
                    </Link>
                    <div className={'hidden xl:flex p-2 bg-slate-100 rounded-xl items-center'}>
                        <input type={'text'} placeholder={'search ...'} className={'bg-transparent outline-none'}/>
                        <Image src={'/search.png'} alt="Home Image" width={14} height={14}  />
                    </div>
                </div>
            </div>
            <div className={'w-[30%] flex items-center gap-4 xl:gap-8 justify-end '}>
                <ClerkLoading>
                    <div className={'inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent ' +
                        'align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white'}>
                    </div>
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <div className="cursor-pointer">
                            <Image src={'/people.png'} alt="People" width={20} height={20}/>
                        </div>
                        <div className="cursor-pointer">
                            <Image src={'/messages.png'} alt="messages" width={20} height={20}/>
                        </div>
                        <div className="cursor-pointer">
                            <Image src={'/notifications.png'} alt="notifications" width={20} height={20}/>
                        </div>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <div className="flex items-center gap-2 ">
                            <Image src={'/login.png'} className={'border-amber-50 hidden md:flex'} alt="login" width={20} height={20}/>
                            <Link href={'/sign-in'} className={'text-sm hidden md:flex'}>Login/Register</Link>
                        </div>
                    </SignedOut>
                </ClerkLoaded>
                <MobileMenu/>
            </div>
        </div>
    );
};

export default NavBar;