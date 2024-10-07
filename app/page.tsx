"use client"

import { useState } from 'react';
import { UrlForm } from "@/app/url-form";
import { UrlCard } from "@/app/url-card";
import { Footer } from './Footer';

interface ShortUrl {
    id: string
    longUrl: string
    shortUrl: string
    alias: string
}

const LoadingScreen = () => (
    <div className="flex items-center justify-center bg-gray-900 text-gray-100">
        <div className="text-center">
            <div className="loader"></div>
            <p>Loading...</p>
        </div>
    </div>
)

export default function EnhancedUrlShortener() {
    const [shortUrls, setShortUrls] = useState<ShortUrl[]>([])
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (longUrl: string, alias: string) => {
        setLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/submit-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ link: longUrl, alias })
            });

            if (!response.ok) {
                throw new Error('Failed to create short URL');
            }

            const out = await response.json();
            // console.log(out.data.data.shortUrl);
            // console.log("data:", out);
            const newShortUrl: ShortUrl = {
                id: Date.now().toString(),
                longUrl,
                shortUrl: out.data.data.shortUrl,
                alias: alias || '',
            }
            // console.log("newShortUrl:", newShortUrl);
            setShortUrls(prev => [newShortUrl, ...prev]);
        } catch (error) {
            console.error('Error creating short URL:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="container mx-auto p-4 max-w-4xl relative z-10">
                <h1 className="text-4xl font-bold mb-8 text-center text-green-400">URL Shortener</h1>

                <UrlForm onSubmit={handleSubmit} />

                {loading && <LoadingScreen />}

                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shortUrls.map(url => (
                            <UrlCard key={url.id} {...url} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}
