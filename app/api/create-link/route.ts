import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/mongodb';
import { customAlphabet } from 'nanoid';
import { COLLECTION_NAMES } from '@/types';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const getHash = customAlphabet(characters, 4);

export async function POST(request: NextRequest) {
    const apiKey = request.headers.get('api-key');
    if (apiKey !== process.env.API_KEY) {
        return NextResponse.json({
            type: 'Error',
            code: 403,
            message: 'Forbidden',
        }, { status: 403 });
    }

    const { link, alias} = await request.json();

    if (!link) {
        return NextResponse.json({
            type: 'Error',
            code: 400,
            message: 'Expected {link: string}',
        }, { status: 400 });
    }

    try {
        const database = await connectToDatabase();
        const urlInfoCollection = database.collection(COLLECTION_NAMES['url-info']);
        const hash = alias || getHash();
        const linkExists = await urlInfoCollection.findOne({ link });
        const shortUrl = `${process.env.NEXT_PUBLIC_HOST}/${hash}`;
        if (!linkExists) {
            await urlInfoCollection.insertOne({
                link,
                uid: hash,
                shortUrl: shortUrl,
                createdAt: new Date(),
            });
        }
        return NextResponse.json({
            type: 'success',
            code: 201,
            data: {
                shortUrl: linkExists?.shortUrl || shortUrl,
                link,
            },
        }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({
            code: 500,
            type: 'error',
            message: e.message,
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        type: 'Error',
        code: 405,
        message: 'Only POST method is accepted on this route',
    }, { status: 405 });
}
