import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckSquare, Square, Image } from "lucide-react"

interface BatchSelectorProps {
  contents: any[]
  selectedBatches: string[]
  onBatchSelection: (batches: string[]) => void
}

export function BatchSelector({ contents = [], selectedBatches = [], onBatchSelection }: BatchSelectorProps) {
  const [detectedBatches, setDetectedBatches] = useState<any[]>([])

  useEffect(() => {
    console.log('BatchSelector: Contents changed:', contents?.length || 0)
    
    // Ensure contents is an array before processing
    if (!Array.isArray(contents)) {
      console.warn('BatchSelector: Contents is not an array:', contents)
      setDetectedBatches([])
      return
    }

    // Filter for image files only
    const imageFiles = contents.filter(item => {
      const isImage = item?.type === 'file' && item?.isImage === true
      console.log('BatchSelector: Checking item:', item?.name, 'isImage:', isImage)
      return isImage
    })

    console.log('BatchSelector: Found image files:', imageFiles?.length || 0)

    // Group images by batch naming convention: batch-iterator-front/back.jpg
    const batches = new Map()

    imageFiles.forEach(file => {
      if (!file?.name) return
      
      const match = file.name.match(/^(.+)-(\d+)-(front|back)\.(jpg|jpeg|png|gif|bmp|webp)$/i)
      if (match) {
        const [, batchName, iterator, side] = match
        const batchKey = `${batchName}-${iterator}`
        
        if (!batches.has(batchKey)) {
          batches.set(batchKey, {
            id: batchKey,
            name: batchKey,
            front: null,
            back: null,
            complete: false
          })
        }
        
        const batch = batches.get(batchKey)
        batch[side.toLowerCase()] = file
        batch.complete = batch.front && batch.back
      }
    })

    const batchArray = Array.from(batches.values())
    console.log('BatchSelector: Detected batches:', batchArray?.length || 0)
    setDetectedBatches(batchArray)
  }, [contents])

  const handleBatchToggle = (batchId: string) => {
    console.log('BatchSelector: Toggling batch:', batchId)
    const newSelection = selectedBatches.includes(batchId)
      ? selectedBatches.filter(id => id !== batchId)
      : [...selectedBatches, batchId]
    
    console.log('BatchSelector: New selection:', newSelection)
    onBatchSelection(newSelection)
  }

  const handleSelectAll = () => {
    const completeBatches = detectedBatches.filter(batch => batch.complete).map(batch => batch.id)
    console.log('BatchSelector: Select all complete batches:', completeBatches)
    onBatchSelection(completeBatches)
  }

  const handleSelectNone = () => {
    console.log('BatchSelector: Deselect all batches')
    onBatchSelection([])
  }

  // Show loading state if contents is not yet available
  if (!Array.isArray(contents)) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Batch Detection</h3>
          <Badge variant="outline">Loading...</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading directory contents...
        </p>
      </div>
    )
  }

  if (detectedBatches.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Batch Detection</h3>
          <Badge variant="outline">0 batches</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No card batches detected. Images should follow the naming convention: batch-001-front.jpg, batch-001-back.jpg
        </p>
      </div>
    )
  }

  const completeBatches = detectedBatches.filter(batch => batch.complete)
  const incompleteBatches = detectedBatches.filter(batch => !batch.complete)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Batch Detection</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{completeBatches.length} complete</Badge>
          {incompleteBatches.length > 0 && (
            <Badge variant="destructive">{incompleteBatches.length} incomplete</Badge>
          )}
        </div>
      </div>

      {completeBatches.length > 0 && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            <CheckSquare className="w-4 h-4 mr-1" />
            Select All Complete
          </Button>
          <Button variant="outline" size="sm" onClick={handleSelectNone}>
            <Square className="w-4 h-4 mr-1" />
            Select None
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {completeBatches.map(batch => (
          <Card
            key={batch.id}
            className={`cursor-pointer transition-all ${
              selectedBatches.includes(batch.id)
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'hover:shadow-md'
            }`}
            onClick={() => handleBatchToggle(batch.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedBatches.includes(batch.id)}
                  onChange={() => handleBatchToggle(batch.id)}
                />
                <div className="flex-1">
                  <h4 className="font-medium">{batch.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Image className="w-4 h-4" />
                    <span>Front & Back</span>
                    <Badge variant="secondary" className="text-xs">Complete</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {incompleteBatches.map(batch => (
          <Card key={batch.id} className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Checkbox disabled />
                <div className="flex-1">
                  <h4 className="font-medium">{batch.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Image className="w-4 h-4" />
                    <span>
                      {batch.front ? 'Front only' : batch.back ? 'Back only' : 'No images'}
                    </span>
                    <Badge variant="destructive" className="text-xs">Incomplete</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedBatches.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {selectedBatches.length} batch{selectedBatches.length !== 1 ? 'es' : ''} selected for processing
          </p>
        </div>
      )}
    </div>
  )
}