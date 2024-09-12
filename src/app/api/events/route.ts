import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// This should be replaced with a proper data store in a production environment
let subscribers = new Map<number, Set<(data: any) => void>>();

export async function GET(req: NextRequest) {
    const postId = Number(req.nextUrl.searchParams.get('postId'));

    if (!postId) {
        return new NextResponse('Missing postId', { status: 400 });
    }

    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            const push = (data: any) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            push({ type: 'connection', message: 'Connected to event stream' });

            if (!subscribers.has(postId)) {
                subscribers.set(postId, new Set());
            }
            subscribers.get(postId)!.add(push);

            const cleanup = () => {
                subscribers.get(postId)?.delete(push);
                if (subscribers.get(postId)?.size === 0) {
                    subscribers.delete(postId);
                }
            };

            req.signal.addEventListener('abort', cleanup);
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}

export async function POST(req: NextRequest) {
    const { postId, attendees } = await req.json();

    if (!postId || !attendees) {
        return new NextResponse('Missing postId or attendees', { status: 400 });
    }

    const subscribersForPost = subscribers.get(Number(postId));
    if (subscribersForPost) {
        for (const push of subscribersForPost) {
            push({ type: 'attendance_update', postId, attendees });
        }
    }

    return new NextResponse(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
}