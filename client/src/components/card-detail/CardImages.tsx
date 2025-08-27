import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, RotateCcw, Download } from "lucide-react"
import { PlaceholderImage } from "@/components/ui/placeholder-image"

interface CardImagesProps {
  card: any
}

export function CardImages({ card }: CardImagesProps) {
  const [currentImage, setCurrentImage] = useState<'front' | 'back'>('front')
  const [isZoomed, setIsZoomed] = useState(false)

  const currentImageSrc = currentImage === 'front' ? card.frontImage : card.backImage

  return (
    <div className="space-y-4">
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-4">
          <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 relative group">
            {currentImageSrc ? (
              <img
                src={currentImageSrc}
                alt={`${card.playerName} ${currentImage}`}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <PlaceholderImage 
              className={`w-full h-full rounded-lg absolute inset-0 ${currentImageSrc ? 'hidden' : ''}`}
              alt={`${card.playerName} ${currentImage} placeholder`}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={currentImage === 'front' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentImage('front')}
                className="text-xs"
              >
                Front
              </Button>
              <Button
                variant={currentImage === 'back' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentImage('back')}
                className="text-xs"
              >
                Back
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}