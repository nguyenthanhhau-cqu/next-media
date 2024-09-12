import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

export async function POST(req: Request) {
    const { userId: currentUserId } = auth();

    if (currentUserId !== 'user_2kyEFBJyLszkG66jjaEO3ryToc7') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, newBalance } = await req.json();

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { balance: parseFloat(newBalance) },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Failed to update balance:', error);
        return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
    }
}