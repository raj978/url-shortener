import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { link, alias } = await request.json();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/create-link`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': `${process.env.API_KEY}`,
            },
            body: JSON.stringify({ link, alias }),
        });

        if (!response.ok) {
            throw new Error('Failed to create short URL');
        }

        const data = await response.json();
        return NextResponse.json({ data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
