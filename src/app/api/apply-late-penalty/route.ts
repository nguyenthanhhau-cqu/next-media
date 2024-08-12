import { NextResponse } from 'next/server';
import { applyLatePenalty } from '@/lib/action';

export async function POST(request: Request) {
    const { postId } = await request.json();

    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const result = await applyLatePenalty(postId);

    if (result.success) {
        return NextResponse.json({ message: 'Late penalty applied successfully' });
    } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }
}