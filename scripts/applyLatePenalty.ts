import { PrismaClient, Post, Like, Attendance, User } from '@prisma/client';
import { toZonedTime } from 'date-fns-tz';

const prisma = new PrismaClient();

async function applyLatePenalty(): Promise<void> {
    const now = new Date();
    console.log(`Starting applyLatePenalty at ${now.toISOString()}`);

    try {
        // First, reset penaltyApplied for all users
        await prisma.user.updateMany({
            where: { penaltyApplied: true },
            data: { penaltyApplied: false }
        });

        // Find all posts (events) that have ended but haven't had penalties applied
        const posts = await prisma.post.findMany({
            where: {
                eventStartTime: { lte: now },
                penaltiesApplied: false
            },
            include: {
                likes: true,
                attendances: true
            }
        });

        for (const post of posts) {
            if (!post.eventStartTime) {
                console.log(`Skipping post ${post.id} - no event start time`);
                continue;
            }

            const usersToUpdate: string[] = [];

            for (const like of post.likes) {
                const attendance = post.attendances.find(a => a.userId === like.userId);

                if (!attendance) {
                    console.log(`Applying penalty to user ${like.userId} for post ${post.id}`);
                    usersToUpdate.push(like.userId);
                }
            }

            if (usersToUpdate.length > 0) {
                // Apply penalties in a single batch operation
                await prisma.user.updateMany({
                    where: { id: { in: usersToUpdate } },
                    data: {
                        balance: { decrement: post.penaltyAmount ?? 0 }, // Use the custom penalty amount
                        penaltyApplied: true
                    }
                });
            }

            // Mark penalties as applied for this post
            await prisma.post.update({
                where: { id: post.id },
                data: { penaltiesApplied: true }
            });

            console.log(`Finished processing post ${post.id}`);
        }

        console.log('Late penalties applied successfully');
    } catch (error) {
        console.error('Error applying late penalties:', error);
    } finally {
        await prisma.$disconnect();
    }
}

applyLatePenalty().catch(error => {
    console.error('Unhandled error in applyLatePenalty:', error);
    process.exit(1);
});