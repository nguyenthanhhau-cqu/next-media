'use client'
import React,{ useState } from 'react';
import Image from "next/image";

const CommentPost = () => {
    const [showFullComment, setShowFullComment] = useState(false);


    const truncateText = (text: string, limit = 100) => {
        if (text.length <= limit) return { short: text, full: text };
        return {
            short: text.slice(0, limit).trim() + '...',
            full: text
        };
    };

    const commentText = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`;

    const { short, full } = truncateText(commentText);

    return (
        <div className={''}>
            {/*WRITE*/}
            <div className="flex items-center gap-4">
                <Image src={'/dog.png'} alt={''} width={32} height={32} className={'w-8 h-8 rounded-full'} />
                <div className="flex-1 flex items-center justify-between bg-slate-100  rounded-xl text-sm px-6 py-2 w-full">
                    <input type={'text'} placeholder={'Write your Comment....'} className={'bg-transparent outline-none flex-1'}/>
                    <Image src={'/emoji.png'} alt={''} width={16} height={16} className={'w-5 h-5 rounded-full'} />
                </div>
            </div>
            {/*COMMENTS*/}
            <div className="">
                {/*COMMENT*/}
                <div className="">

                </div>
                {/*Avatar*/}
                <div className="flex gap-4 justify-between mt-6 ">
                    <Image src={'/dog.png'} alt={''} width={40} height={40} className={'w-10 h-10 rounded-full'} />
                {/*DESC*/}
                    <div className="flex flex-col gap-2 flex-1  ">
                        <span className={'text-base font-semibold font-sans'}>JackieLove</span>
                        <p className={'text-sm '}>
                            {showFullComment ? full : short}
                            {!showFullComment && full.length > short.length && (
                                <span
                                    className="text-blue-500 cursor-pointer ml-1"
                                    onClick={() => setShowFullComment(true)}
                                >
                                        see more
                                    </span>
                            )}
                        </p>
                        <div className={'flex items-center gap-6 text-xs text-gray-500 mt-2'}>
                            <div className="flex items-center gap-2">
                                <Image src={'/like.png'} alt={''} width={12} height={12}
                                       className="cursor-pointer w-4 h-4"/>

                                <span className={'text-gray-300'}>|</span>
                                <span className={'text-gray-500'}>123 Likes</span>
                            </div>
                            <div className={''}>
                                Reply
                            </div>
                        </div>
                    </div>
                    <Image src={'/more.png'} alt={''} width={16} height={16} className="cursor-pointer w-4 h-4"
                    />
                </div>
            </div>
        </div>
    );
};

export default CommentPost;