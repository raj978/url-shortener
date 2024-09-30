"use client"

import { useState } from 'react'
import { UrlForm} from "@/app/url-form";
import { UrlCard} from "@/app/url-card";
import { Footer } from './Footer'

interface ShortUrl {
    id: string
    longUrl: string
    shortUrl: string
    alias: string
}

export default function EnhancedUrlShortener() {
    const [shortUrls, setShortUrls] = useState<ShortUrl[]>([])

    const handleSubmit = (longUrl: string, alias: string) => {
        const newShortUrl: ShortUrl = {
            id: Date.now().toString(),
            longUrl,
            shortUrl: `https://short.url/${alias || Math.random().toString(36).substr(2, 6)}`,
            alias: alias || '',
        }

        setShortUrls(prev => [newShortUrl, ...prev])
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="container mx-auto p-4 max-w-4xl relative z-10">
                <h1 className="text-4xl font-bold mb-8 text-center text-green-400">URL Shortener</h1>

                <UrlForm onSubmit={handleSubmit} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shortUrls.map(url => (
                        <UrlCard key={url.id} {...url} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}
