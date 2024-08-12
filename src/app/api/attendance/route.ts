import { NextResponse } from 'next/server';
import { checkAttendance, recordAttendance } from "@/lib/action";

export async function POST(request: Request) {
    const { postId, userId, action, timestamp } = await request.json();

    if (action === 'check') {
        const result = await checkAttendance(postId, userId);
        return NextResponse.json({ attended: result });
    } else if (action === 'record') {
        await recordAttendance(postId, userId, timestamp);
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}