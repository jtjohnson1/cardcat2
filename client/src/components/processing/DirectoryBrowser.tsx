import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FolderOpen, 
  Folder, 
  Image as ImageIcon, 
  ChevronLeft,
  Home
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DirectoryBrowserProps {
  currentDirectory: string
  directoryContents: any[]
  loading: boolean
  onDirectoryChange: (path: string) => void
}

export function DirectoryBrowser({ 
  currentDirectory, 
  directoryContents, 
  loading, 
  onDirectoryChange 
}: DirectoryBrowserProps) {
  const handleGoUp = () => {
    const parentPath = currentDirectory.split('/').slice(0, -1).join('/') || '/'
    onDirectoryChange(parentPath)
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-blue-500" />
          Directory Browser
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDirectoryChange('/')}
            className="h-6 px-2"
          >
            <Home className="w-3 h-3" />
          </Button>
          {currentDirectory !== '/' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoUp}
              className="h-6 px-2"
            >
              <ChevronLeft className="w-3 h-3" />
              Up
            </Button>
          )}
          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {currentDirectory}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {directoryContents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No files or folders found
              </p>
            ) : (
              directoryContents.map((item) => (
                <div
                  key={item.name}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                    item.type === 'directory' && "cursor-pointer"
                  )}
                  onClick={() => item.type === 'directory' && onDirectoryChange(item.path)}
                >
                  {item.type === 'directory' ? (
                    <Folder className="w-4 h-4 text-blue-500" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.size && (
                    <span className="text-xs text-gray-500 ml-auto">
                      {(item.size / 1024).toFixed(1)} KB
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}