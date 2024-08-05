"use server"

import {auth,clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {User} from "@prisma/client";
import nodemailer from 'nodemailer';


export const switchFollow = async (userId: string) => {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
        throw new Error("User is not authenticated!");
    }

    try {
        const existingFollow = await prisma.follower.findFirst({
            where: {
                followerId: currentUserId,
                followingId: userId,
            },
        });

        if (existingFollow) {
            await prisma.follower.delete({
                where: {
                    id: existingFollow.id,
                },
            });
        } else {
            const existingFollowRequest = await prisma.followRequest.findFirst({
                where: {
                    senderId: currentUserId,
                    receiverId: userId,
                },
            });

            if (existingFollowRequest) {
                await prisma.followRequest.delete({
                    where: {
                        id: existingFollowRequest.id,
                    },
                });
            } else {
                await prisma.followRequest.create({
                    data: {
                        senderId: currentUserId,
                        receiverId: userId,
                    },
                });
            }
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const acceptFollowRequest = async (userId: string) => {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
        throw new Error("User is not Authenticated!!");
    }

    try {
        const existingFollowRequest = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                receiverId: currentUserId,
            },
        });

        if (existingFollowRequest) {
            await prisma.followRequest.delete({
                where: {
                    id: existingFollowRequest.id,
                },
            });

            await prisma.follower.create({
                data: {
                    followerId: userId,
                    followingId: currentUserId,
                },
            });
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const declineFollowRequest = async (userId: string) => {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
        throw new Error("User is not Authenticated!!");
    }

    try {
        const existingFollowRequest = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                receiverId: currentUserId,
            },
        });

        if (existingFollowRequest) {
            await prisma.followRequest.delete({
                where: {
                    id: existingFollowRequest.id,
                },
            });
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};
export const updateProfile = async (
    prevState: { success: boolean; error: boolean },
    payload: { formData: FormData; cover: string }
) => {
    const { formData, cover } = payload;
    const fields = Object.fromEntries(formData);

    const { userId } = auth();

    if (!userId) {
        return { success: false, error: true };
    }

    try {
        // Fetch current user data
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                cover: true,
                name: true,
                surname: true,
                description: true,
                city: true,
                school: true,
                work: true,
            },
        });

        if (!currentUser) {
            return { success: false, error: true };
        }

        // Merge current data with new data, prioritizing new data
        const mergedFields = {
            ...currentUser,
            ...Object.fromEntries(
                Object.entries(fields).filter(([_, value]) => value !== "")
            ),
            cover: cover || currentUser.cover, // Use new cover if provided, otherwise keep the existing one
        };

        const Profile = z.object({
            cover: z.string().optional(),
            name: z.string().max(60).optional(),
            surname: z.string().max(60).optional(),
            description: z.string().max(255).optional(),
            city: z.string().max(60).optional(),
            school: z.string().max(60).optional(),
            work: z.string().max(60).optional(),
            website: z.string().max(60).optional(),
        });

        const validatedFields = Profile.safeParse(mergedFields);

        if (!validatedFields.success) {
            console.log(validatedFields.error.flatten().fieldErrors);
            return { success: false, error: true };
        }

        await prisma.user.update({
            where: { id: userId },
            data: validatedFields.data,
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};



export const addComment = async (postId: number, desc: string) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        return await prisma.comment.create({
            data: {
                desc,
                userId,
                postId,
            },
            include: {
                user: true,
            },
        });
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const addPost = async (formData: FormData, img: string) => {
    const desc = formData.get("desc") as string;

    const Desc = z.string().min(1).max(255);

    const validatedDesc = Desc.safeParse(desc);

    if (!validatedDesc.success) {
        console.log("description is not valid");
        return;
    }
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        await prisma.post.create({
            data: {
                desc: validatedDesc.data,
                userId,
                img,
            },
        });

        revalidatePath("/");
    } catch (err) {
        console.log(err);
    }
};


export const deletePost = async (postId: number) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        await prisma.post.delete({
            where: {
                id: postId,
                userId,
            },
        });
        revalidatePath("/")
    } catch (err) {
        console.log(err);
    }
};
export const switchLike = async (postId: number): Promise<User | null> => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            return null;
        } else {
            const newLike = await prisma.like.create({
                data: {
                    userId,
                    postId,
                },
                include: {
                    user: true,
                },
            });
            return newLike.user;
        }
    } catch (err) {
        console.error(err);
        throw new Error("Failed to switch like");
    }
};

export const addStory = async (img: string) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        const existingStory = await prisma.story.findFirst({
            where: {
                userId,
            },
        });

        if (existingStory) {
            await prisma.story.delete({
                where: {
                    id: existingStory.id,
                },
            });
        }
        return await prisma.story.create({
            data: {
                userId,
                img,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
            include: {
                user: true,
            },
        });

    } catch (err) {
        console.log(err);
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

async function sendEmail(to: string, subject: string, text: string) {
    try {
        await transporter.sendMail({ from: process.env.GMAIL_USER, to, subject, text });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export const triggerEvent = async (postId: number) => {
    const { userId } = auth();

    if (userId !== 'user_2kDaQgI2XRuouICyvx3L5l8K9AB') {
        throw new Error("Unauthorized");
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { likes: true },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        // Get all users who liked the post
        const likedUserIds = post.likes.map(like => like.userId);

        console.log('Liked user IDs:', likedUserIds);

        // Fetch user emails from Clerk
        const usersResponse = await clerkClient.users.getUserList({ userId: likedUserIds });

        if (!usersResponse || !usersResponse.data || !Array.isArray(usersResponse.data)) {
            throw new Error(`Invalid response from Clerk: ${JSON.stringify(usersResponse)}`);
        }

        const users = usersResponse.data;

        for (const user of users) {
            const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId);
            if (primaryEmail) {
                await sendEmail(
                    primaryEmail.emailAddress,
                    'Bóng Đá Confirmation',
                    `Xin Chào ${user.firstName},\n"${post.desc}". Ae nhớ đến đúng giờ nha 😘 \nThank you.`
                );
            }
        }


    } catch (err) {
        console.error('Error in triggerEvent:', err);
        // @ts-ignore
        throw new Error(`Failed to trigger event: ${err.message}`);
    }
};
export const cancelEvent = async (postId: number) => {
    const { userId } = auth();

    if (userId !== 'user_2kDaQgI2XRuouICyvx3L5l8K9AB') {
        throw new Error("Unauthorized");
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { likes: true },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        // Get all users who liked the post
        const likedUserIds = post.likes.map(like => like.userId);


        // Fetch user emails from Clerk
        const usersResponse = await clerkClient().users.getUserList({ userId: likedUserIds });

        console.log('Fetched users response:', usersResponse);

        if (!usersResponse || !usersResponse.data || !Array.isArray(usersResponse.data)) {
            throw new Error(`Invalid response from Clerk: ${JSON.stringify(usersResponse)}`);
        }

        const users = usersResponse.data;

        for (const user of users) {
            const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId);
            if (primaryEmail) {
                await sendEmail(
                    primaryEmail.emailAddress,
                    'Bóng Đá Cancellation',
                    `Xin Chào ${user.firstName},\n"${post.desc}".\nhas been cancelled 😭.`
                );
            }
        }


        // await prisma.post.delete({
        //     where: { id: postId },
        // });

    } catch (err) {
        console.error('Error in cancelEvent:', err);
        // @ts-ignore
        throw new Error(`Failed to cancel event: ${err.message}`);
    }
};
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const divideTeams = async (postId: number) => {
    const { userId } = auth();

    if (userId !== 'user_2kDaQgI2XRuouICyvx3L5l8K9AB') {
        throw new Error("Unauthorized");
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                likes: {
                    include: { user: true },
                    orderBy: { createdAt: 'asc' }
                }
            },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const players = post.likes.map(like => ({
            id: like.user.id,
            username: like.user.username,
            name: like.user.name || '',
            avatar: like.user.avatar || ''
        }));

        let teamA: typeof players = [];
        let teamB: typeof players = [];
        let substitutes: typeof players = [];

        if (players.length <= 14) {
            // If 14 or fewer players, divide them into two teams
            const shuffledPlayers = shuffleArray([...players]);
            const halfPoint = Math.ceil(shuffledPlayers.length / 2);
            teamA = shuffledPlayers.slice(0, halfPoint);
            teamB = shuffledPlayers.slice(halfPoint);
        } else {
            // If more than 14 players, take first 14 for teams, rest are substitutes
            const mainPlayers = players.slice(0, 14);
            substitutes = players.slice(14);

            const shuffledMainPlayers = shuffleArray([...mainPlayers]);
            teamA = shuffledMainPlayers.slice(0, 7);
            teamB = shuffledMainPlayers.slice(7);
        }

        await prisma.teamDivision.create({
            data: {
                postId,
                teamA: JSON.stringify(teamA),
                teamB: JSON.stringify(teamB),
                substitutes: JSON.stringify(substitutes)
            }
        });

        revalidatePath('/team');
    } catch (err) {
        console.error('Error in divideTeams:', err);
        // @ts-ignore
        throw new Error(`Failed to divide teams: ${err.message}`);
    }
};
export const deleteTeamDisplay = async () => {
    const { userId } = auth();

    if (userId !== 'user_2kDaQgI2XRuouICyvx3L5l8K9AB') {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.teamDivision.deleteMany({});
        revalidatePath('/team');
    } catch (err) {
        console.error('Error in deleteTeamDisplay:', err);
        // @ts-ignore
        throw new Error(`Failed to delete team display: ${err.message}`);
    }
};
export const getTeamDivision = async () => {
    try {
        const teamDivision = await prisma.teamDivision.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!teamDivision) return null;

        return {
            teamA: JSON.parse(teamDivision.teamA),
            teamB: JSON.parse(teamDivision.teamB),
            substitutes: JSON.parse(teamDivision.substitutes)
        };
    } catch (err) {
        console.error('Error in getTeamDivision:', err);
        // @ts-ignore
        throw new Error(`Failed to get team division: ${err.message}`);
    }
};
