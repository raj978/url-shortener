
//
// 'use client'
//
// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Copy, QrCode } from "lucide-react"
// import { QRCodeSVG } from 'qrcode.react'
//
// interface UrlCardProps {
//   longUrl: string
//   shortUrl: string
//   alias: string
// }
//
// export function UrlCard({ longUrl, shortUrl, alias }: UrlCardProps) {
//   const [showQR, setShowQR] = useState(false)
//   const [copied, setCopied] = useState(false)
//
//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }
//
//   const getBaseUrl = (url: string) => {
//     const index = url.indexOf('?')
//     return index === -1 ? url : url.substring(0, index)
//   }
//
//   return (
//     <Card className="bg-gray-800 border border-gray-700">
//       <CardContent className="p-4">
//         <p className="text-sm text-gray-400 truncate mb-2">{getBaseUrl(longUrl)}</p>
//         <div className="flex items-center justify-between mb-2 bg-gray-700 rounded-md p-2">
//           <a
//             href={shortUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
//           >
//             {shortUrl}
//           </a>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   onClick={() => copyToClipboard(shortUrl)}
//                   className="ml-2 bg-gray-600 hover:bg-gray-500 text-white"
//                 >
//                   {copied ? "Copied!" : <Copy className="h-4 w-4" />}
//                   <span className="sr-only">Copy short URL</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Copy to clipboard</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//         {alias && <p className="text-sm text-gray-400 mb-2">Alias: {alias}</p>}
//         <div className="text-sm text-gray-400 mb-2">
//           <p>Old URL: {getBaseUrl(longUrl)}</p>
//           <p>{getBaseUrl(longUrl).length} characters</p>
//           <p>New URL: {shortUrl}</p>
//           <p>{shortUrl.length} characters</p>
//         </div>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setShowQR(!showQR)}
//           className="mt-2 border-gray-600 hover:bg-gray-700 hover:text-white"
//         >
//           <QrCode className="h-4 w-4 mr-2" />
//           {showQR ? "Hide QR Code" : "Show QR Code"}
//         </Button>
//         {showQR && (
//           <div className="mt-4 flex justify-center bg-white p-2 rounded">
//             <QRCodeSVG value={shortUrl} size={256} />
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, QrCode, Download } from "lucide-react"
import { QRCodeSVG } from 'qrcode.react'
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
    const canvas = document.getElementById('qrCode') as HTMLCanvasElement
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = 'qrcode.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  const handleEmailSubmit = () => {
    // Handle email submission logic here
    console.log(`Email: ${email}, Short URL: ${shortUrl}`)
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
          <div className="mt-4 flex flex-col items-center bg-white p-2 rounded">
            <QRCodeSVG id="qrCode" value={shortUrl} size={256} />
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
