import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Folder, File, Image, ArrowUp, Loader2 } from "lucide-react"

interface DirectoryBrowserProps {
  currentDirectory: string
  contents: any[]
  onDirectoryChange: (path: string) => void
  loading: boolean
}

export function DirectoryBrowser({ 
  currentDirectory, 
  contents = [], 
  onDirectoryChange, 
  loading 
}: DirectoryBrowserProps) {
  console.log('DirectoryBrowser: Rendering with contents:', contents?.length || 0, 'loading:', loading)

  // Ensure contents is always an array
  const safeContents = Array.isArray(contents) ? contents : []

  const handleDirectoryClick = (item: any) => {
    if (item.type === 'directory') {
      console.log('DirectoryBrowser: Navigating to directory:', item.path)
      onDirectoryChange(item.path)
    }
  }

  const handleParentDirectory = () => {
    const parentPath = currentDirectory === '/' ? '/' : currentDirectory.split('/').slice(0, -1).join('/') || '/'
    console.log('DirectoryBrowser: Navigating to parent:', parentPath)
    onDirectoryChange(parentPath)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading directory contents...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4" />
          <span className="text-sm font-medium">Current Directory:</span>
          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {currentDirectory}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {safeContents.length} items
          </Badge>
          {currentDirectory !== '/' && (
            <Button variant="outline" size="sm" onClick={handleParentDirectory}>
              <ArrowUp className="w-4 h-4 mr-1" />
              Parent
            </Button>
          )}
        </div>
      </div>

      {safeContents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No items found in this directory
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {safeContents.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                item.type === 'directory'
                  ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                  : 'border-gray-100 dark:border-gray-800'
              }`}
              onClick={() => handleDirectoryClick(item)}
            >
              <div className="flex-shrink-0">
                {item.type === 'directory' ? (
                  <Folder className="w-5 h-5 text-blue-500" />
                ) : item.isImage ? (
                  <Image className="w-5 h-5 text-green-500" />
                ) : (
                  <File className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.type === 'directory' ? 'Directory' : 'File'}
                  {item.isImage && ' (Image)'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}