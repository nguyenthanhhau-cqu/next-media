import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import StoryCarousel from "./StoryCarousel";

const Stories = async () => {
    const { userId: currentUserId } = auth();

    if (!currentUserId) return null;

    const stories = await prisma.story.findMany({
        where: {
            expiresAt: {
                gt: new Date(),
            },
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <StoryCarousel stories={stories} userId={currentUserId} />
        </div>
    );
};

export default Stories;