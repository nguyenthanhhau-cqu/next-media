import React from 'react';
import Image from "next/image";
import {Comment} from "postcss";
import CommentPost from "@/component/CommentPost";

const Post = () => {
    return (
        <div className="flex flex-col gap-4 my-6">
            {/*USER*/}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image src={'/dog.png'} alt={''} width={40} height={40} className={'w-10 h-10 rounded-full'} />
                    <span className={'text-base font-semibold font-sans'} >JackieLove</span>
                </div>
                <Image src={'/more.png'} alt={''} width={16} height={16}  />
            </div>
            {/*DESC*/}
            <div className="flex flex-col gap-4 max-w-full">
                <div className="w-full min-h-96 relative">
                    <Image src={'https://images.pexels.com/photos/25396171/pexels-photo-25396171/free-photo-of-a-woman-on-a-bicycle-with-a-basket-of-fruit-and-vegetables.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                           alt={''} fill className={'object-cover rounded-md'} />
                </div>
                <p className={'text-justify'}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
            </div>
            {/*INTERACTION*/}
            <div className="flex items-center justify-between text-sm">
                <div className="flex gap-8">
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
                        <Image src={'/like.png'} alt={''} width={16} height={16} className={'cursor-pointer'}/>
                        <span className={'text-gray-300'}>|</span>
                        <span className={'text-gray-500'}>123 <span className={'hidden md:inline'}> Likes</span></span>

                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
                        <Image src={'/comment.png'} alt={''} width={16} height={16} className={'cursor-pointer'}/>
                        <span className={'text-gray-300'}>|</span>
                        <span className={'text-gray-500'}>123 <span className={'hidden md:inline'}> Comments</span></span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
                        <Image src={'/share.png'} alt={''} width={16} height={16} className={'cursor-pointer'}/>
                        <span className={'text-gray-300'}>|</span>
                        <span className={'text-gray-500'}>123 <span className={'hidden md:inline'}> Shares</span></span>

                    </div>
                </div>
            </div>
            <CommentPost />
        </div>
    );
};

export default Post;