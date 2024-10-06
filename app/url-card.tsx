import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, QrCode, Download } from "lucide-react"
import { QRCode } from 'react-qrcode-logo'
import { Input } from "@/components/ui/input"

interface UrlCardProps {
  longUrl: string
  shortUrl: string
  alias: string
}

export function UrlCard({ longUrl, shortUrl, alias }: UrlCardProps) {
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const qrRef = useRef<HTMLDivElement>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getBaseUrl = (url: string) => {
    const index = url.indexOf('?')
    return index === -1 ? url : url.substring(0, index)
  }

  const downloadQRCode = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector('svg')
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)
          const pngFile = canvas.toDataURL('image/png')
          const downloadLink = document.createElement('a')
          downloadLink.href = pngFile
          downloadLink.download = 'qrcode.png'
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        }
        img.src = 'data:image/svg+xml;base64,' + window.btoa(svgData);
      }
    }
  }

  const handleEmailSubmit = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, shortUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      console.log(`Email sent to: ${email}`)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  return (
    <Card className="bg-gray-800 border border-gray-700">
      <CardContent className="p-4">
        <p className="text-sm text-gray-400 truncate mb-2">{getBaseUrl(longUrl)}</p>
        <div className="flex items-center justify-between mb-2 bg-gray-700 rounded-md p-2">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
          >
            {shortUrl}
          </a>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(shortUrl)}
                  className="ml-2 bg-gray-600 hover:bg-gray-500 text-white"
                >
                  {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy short URL</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {alias && <p className="text-sm text-gray-400 mb-2">Alias: {alias}</p>}
        <div className="text-sm text-gray-400 mb-2">
          <p>Old URL: {getBaseUrl(longUrl)}</p>
          <p>{getBaseUrl(longUrl).length} characters</p>
          <p>New URL: {shortUrl}</p>
          <p>{shortUrl.length} characters</p>
        </div>
        <div className="flex items-center mb-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mr-2"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleEmailSubmit}
            className="border-gray-600 hover:bg-gray-700 hover:text-white"
          >
            Send
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowQR(!showQR)}
          className="mt-2 border-gray-600 hover:bg-gray-700 hover:text-white"
        >
          <QrCode className="h-4 w-4 mr-2" />
          {showQR ? "Hide QR Code" : "Show QR Code"}
        </Button>
        {showQR && (
          <div ref={qrRef} className="mt-4 flex flex-col items-center bg-white p-2 rounded">
            <QRCode value={shortUrl} size={256} />
            <Button
              variant="outline"
              size="sm"
              onClick={downloadQRCode}
              className="mt-2 border-gray-600 hover:bg-gray-700 hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Save QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
