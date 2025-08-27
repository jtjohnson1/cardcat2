import { ImageIcon } from "lucide-react"

interface PlaceholderImageProps {
  className?: string
  alt?: string
}

export function PlaceholderImage({ className = "", alt = "Placeholder" }: PlaceholderImageProps) {
  return (
    <div className={`bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ${className}`}>
      <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
    </div>
  )
}