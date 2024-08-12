"use client";

import { useUser } from "@clerk/nextjs";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./AddPostButton";
import { addPost } from "@/lib/action";

const AddPost = () => {
    const { user, isLoaded } = useUser();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [img, setImg] = useState<any>();

    if (!isLoaded) {
        return "Loading...";
    }

    return (
        <div>
            {user?.id === 'user_2kMGhFcDdkVuPB725T7KUPNXuJC' && (
                <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
                    <Image
                        src={user?.imageUrl || "/noAvatar.png"}
                        alt=""
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-full"
                    />
                    <div className="flex-1">
                        <form action={(formData) => addPost(formData, img?.secure_url || "")}
                              className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Post Title"
                                className="bg-slate-100 rounded-lg p-2"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea
                                placeholder="What's on your mind?"
                                className="flex-1 bg-slate-100 rounded-lg p-2"
                                name="desc"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            >
                            </textarea>

                            <input
                                type="datetime-local"
                                placeholder="Event Start Time (Melbourne time)"
                                className="bg-slate-100 rounded-lg p-2"
                                name="eventStartTime"
                                value={eventStartTime}
                                onChange={(e) => setEventStartTime(e.target.value)}
                            />

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4 text-gray-400">
                                    <CldUploadWidget
                                        uploadPreset="social"
                                        onSuccess={(result, {widget}) => {
                                            setImg(result.info);
                                            widget.close();
                                        }}
                                    >
                                        {({open}) => (
                                            <div
                                                className="flex items-center gap-2 cursor-pointer"
                                                onClick={() => open()}
                                            >
                                                <Image src="/addimage.png" alt="" width={20} height={20}/>
                                                Photo
                                            </div>
                                        )}
                                    </CldUploadWidget>
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <Image src="/addVideo.png" alt="" width={20} height={20}/>
                                        Video
                                    </div>
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <Image src="/poll.png" alt="" width={20} height={20}/>
                                        Poll
                                    </div>
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <Image src="/addevent.png" alt="" width={20} height={20}/>
                                        Event
                                    </div>
                                </div>
                                <AddPostButton/>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddPost;