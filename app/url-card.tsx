import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, QrCode, Download } from "lucide-react"
import { QRCode } from 'react-qrcode-logo'
import { Input } from "@/components/ui/input"
import {sendEmail} from "@/email/send-email";
import { toast, ToastContainer } from 'react-toastify';

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

  // Function to handle the download of the QR code
  const handleDownload = () => {
    const qrCanvas = qrRef.current?.querySelector('canvas');
    if (qrCanvas) {
      const image = qrCanvas.toDataURL('image/png'); // Convert canvas to image
      const link = document.createElement('a');
      link.href = image;
      link.download = 'qrcode.png'; // Set the download name
      link.click(); // Trigger the download
    }
  };

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
        <form
            className="flex items-center mb-2"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);
              formData.append('email', email);
              formData.append('shortUrl', shortUrl);
              formData.append('longUrl', longUrl);
              const { error } = await sendEmail(formData);

              if (error) {
                toast.error(error);
                return;
              }

              toast.success("Email sent successfully!");
            }}
        >
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
            type="submit"
            className="border-gray-600 hover:bg-gray-700 hover:text-white"
          >
            Send
          </Button>
        </form>
        <ToastContainer />
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
              onClick={handleDownload}
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
