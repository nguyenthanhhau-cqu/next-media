"use server"

import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {User} from "@prisma/client";


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
        const existingLike = await prisma.like.findFirst({
            where: {
                postId,
                userId,
            },
            include: {
                user: true, // Include user information
            },
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            return null; // User unliked
        } else {
            const newLike = await prisma.like.create({
                data: {
                    postId,
                    userId,
                },
                include: {
                    user: true, // Include user information
                },
            });
            return newLike.user; // Return user info for the new like
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong");
    }
};
