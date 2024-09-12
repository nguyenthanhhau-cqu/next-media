"use client";

import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Story, User } from "@prisma/client";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useUser } from "@clerk/nextjs";
import { addStory } from "@/lib/action";
import StoryViewer from "./StoryViewer";
import { useRouter } from 'next/navigation';

type StoryWithUser = Story & {
    user: User;
};

interface StoryCarouselProps {
    stories: StoryWithUser[];
    userId: string;
}

const StoryCarousel = ({ stories: initialStories, userId }: StoryCarouselProps) => {
    const router = useRouter();
    const [stories, setStories] = useState(initialStories);
    const [img, setImg] = useState<any>();
    const [selectedStory, setSelectedStory] = useState<StoryWithUser | null>(null);
    const { user } = useUser();

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        variableWidth: true,
        slidesToShow: 6,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const handleAddStory = async () => {
        if (!img?.secure_url) return;

        try {
            const createdStory = await addStory(img.secure_url);
            setStories((prev) => [createdStory!, ...prev]);
            setImg(null);

            window.location.reload();

        } catch (err) {
            console.error("Error adding story:", err);
        }
    };

    const handleStoryClick = (story: StoryWithUser) => {
        setSelectedStory(story);
    };

    const handleCloseStory = () => {
        setSelectedStory(null);
    };

    return (
        <div className="p-2">
            <Slider {...settings}>
                <CldUploadWidget
                    uploadPreset="social"
                    onSuccess={(result, { widget }) => {
                        setImg(result.info);
                        widget.close();
                    }}
                >
                    {({ open }) => (
                        <div className="flex flex-col items-center cursor-pointer px-1">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 p-0.5">
                                <div
                                    className="w-full h-full bg-white rounded-full flex items-center justify-center"
                                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                                        e.preventDefault();
                                        open();
                                    }}
                                >
                                    <div className="text-2xl text-gray-300">+</div>
                                </div>
                            </div>
                            <span className="text-xs mt-1 text-center">Your story</span>
                            {img && (
                                <button
                                    onClick={handleAddStory}
                                    className="mt-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded"
                                >
                                    Post
                                </button>
                            )}
                        </div>
                    )}
                </CldUploadWidget>

                {stories.map((story) => (
                    <div
                        key={story.id}
                        className="inline-block px-2" // Remove flex and cursor-pointer
                        style={{width: 'auto'}} // Override the 100% width
                    >
                        <div
                            className="flex flex-col gap items-center w-14 cursor-pointer"
                            onClick={() => handleStoryClick(story)}
                        >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 p-0.5">
                                <Image
                                    src={story.user.avatar || "/noAvatar.png"}
                                    alt=""
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <span className="text-xs mt-1 text-center truncate w-14">
                {story.user.username}
                </span>
                        </div>
                    </div>
                ))}
            </Slider>

            {selectedStory && (
                <StoryViewer story={selectedStory} onClose={handleCloseStory}/>
            )}
        </div>
    );
};

export default StoryCarousel;