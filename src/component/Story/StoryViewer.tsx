import { Story, User } from "@prisma/client";
import Image from "next/image";

type StoryWithUser = Story & {
    user: User;
};

interface StoryViewerProps {
    story: StoryWithUser;
    onClose: () => void;
}

const StoryViewer = ({ story, onClose }: StoryViewerProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-lg w-full h-[80vh]">
                <button
                    className="absolute top-4 right-4 text-white text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="bg-white rounded-lg overflow-hidden h-full">
                    <div className="p-4 bg-gray-100">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 p-0.5 mr-3">
                                <Image
                                    src={story.user.avatar || "/noAvatar.png"}
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <span className="font-medium">
                                {story.user.username}
                            </span>
                        </div>
                    </div>
                    <div className="relative h-[calc(100%-64px)]">
                        <Image
                            src={story.img}
                            alt="Story"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryViewer;