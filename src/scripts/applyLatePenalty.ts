import { PrismaClient, Post, Like, Attendance, User } from '@prisma/client';
import {format, toZonedTime} from 'date-fns-tz';

const prisma = new PrismaClient();

async function applyLatePenalty(): Promise<void> {
    const now = new Date();

    try {
        // Find all posts (events) that have started but haven't had penalties applied
        const posts: (Post & { likes: Like[] })[] = await prisma.post.findMany({
            where: {
                eventStartTime: { lte: now },
                penaltiesApplied: false
            },
            include: { likes: true }
        });

        for (const post of posts) {
            if (!post.eventStartTime) continue; // Skip if no event start time

            const eventStartMelbourne = toZonedTime(post.eventStartTime, 'Australia/Melbourne');

            for (const like of post.likes) {
                const attendance: Attendance | null = await prisma.attendance.findUnique({
                    where: {
                        postId_userId: {
                            postId: post.id,
                            userId: like.userId
                        }
                    }
                });

                if (!attendance || (attendance.attendedAt && toZonedTime(attendance.attendedAt, 'Australia/Melbourne') > eventStartMelbourne)) {
                    // Apply penalty
                    await prisma.user.update({
                        where: { id: like.userId },
                        data: { balance: { decrement: 0.5 } }
                    });

                    console.log(`Penalty applied to user ${like.userId} for post ${post.id}`);
                }
            }

            // Mark penalties as applied for this post
            await prisma.post.update({
                where: { id: post.id },
                data: { penaltiesApplied: true }
            });

            console.log(`Penalties processed for post ${post.id}`);
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