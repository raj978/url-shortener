import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/mongodb';
import { COLLECTION_NAMES } from '@/types';

export async function GET(request: NextRequest) {
    const { pathname } = new URL(request.url);
    const hash = pathname.split('/').pop();
    // console.log("This is the hash" ,hash);
    if (!hash) {
        return NextResponse.json({ message: 'Hash is required' }, { status: 400 });
    }

    try {
        const database = await connectToDatabase();
        const collection = database.collection(COLLECTION_NAMES['url-info']);
        const campaign = await collection.findOne({ uid: hash });

        if (campaign) {
            // console.log("This is the url" ,campaign.link);
            return NextResponse.json({ link: campaign.link }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Requested link not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
