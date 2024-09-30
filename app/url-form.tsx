import { useState } from 'react'

interface UrlFormProps {
    onSubmit: (longUrl: string, alias: string) => void
}

export function UrlForm({ onSubmit }: UrlFormProps) {
    const [longUrl, setLongUrl] = useState('')
    const [alias, setAlias] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!longUrl) return
        onSubmit(longUrl, alias)
        setLongUrl('')
        setAlias('')
    }

    return (
        <div className="bg-gray-800 rounded-lg shadow-md mb-8 p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="longUrl" className="block text-green-400 mb-1">Long URL</label>
                    <input
                        id="longUrl"
                        type="url"
                        placeholder="Enter long URL"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="alias" className="block text-green-400 mb-1">Custom Alias (optional)</label>
                    <input
                        id="alias"
                        type="text"
                        placeholder="Enter custom alias"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                    Shorten URL
                </button>
            </form>
        </div>
    )
}
