import { NextRequest, NextResponse } from 'next/server';
import { checkAttendance, recordAttendance } from "@/lib/action";

export async function GET(request: NextRequest) {
    const postId = Number(request.nextUrl.searchParams.get('postId'));
    const userId = request.nextUrl.searchParams.get('userId');

    if (!postId || !userId) {
        return NextResponse.json({ error: 'Missing postId or userId' }, { status: 400 });
    }

    try {
        const result = await checkAttendance(postId, userId);
        return NextResponse.json({ attended: result });
    } catch (error) {
        console.error('Error checking attendance:', error);
        return NextResponse.json({ error: 'Failed to check attendance' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { postId, userId, action, timestamp } = await request.json();

    if (action === 'check') {
        try {
            const result = await checkAttendance(postId, userId);
            return NextResponse.json({ attended: result });
        } catch (error) {
            console.error('Error checking attendance:', error);
            return NextResponse.json({ error: 'Failed to check attendance' }, { status: 500 });
        }
    } else if (action === 'record') {
        try {
            await recordAttendance(postId, userId, timestamp);
            return NextResponse.json({ success: true });
        } catch (error) {
            console.error('Error recording attendance:', error);
            if (error instanceof Error && error.message === 'Already attended') {
                return NextResponse.json({ error: 'Already attended', attended: true }, { status: 400 });
            }
            return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
        }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}