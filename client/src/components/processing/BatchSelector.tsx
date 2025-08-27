import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckSquare,
  Square,
  Image as ImageIcon,
  AlertTriangle
} from "lucide-react"

interface BatchSelectorProps {
  directoryContents: any[]
  selectedBatches: string[]
  onBatchSelectionChange: (batches: string[]) => void
}

export function BatchSelector({
  directoryContents,
  selectedBatches,
  onBatchSelectionChange
}: BatchSelectorProps) {
  const [detectedBatches, setDetectedBatches] = useState<any[]>([])

  useEffect(() => {
    // Detect card pairs based on naming convention
    const imageFiles = directoryContents.filter(item =>
      item.type === 'file' && /\.(jpg|jpeg|png)$/i.test(item.name)
    )

    const batches: { [key: string]: { front?: any, back?: any } } = {}

    imageFiles.forEach(file => {
      const match = file.name.match(/^(.+)-(\d+)-(front|back)\.(jpg|jpeg|png)$/i)
      if (match) {
        const [, batchName, iterator, side] = match
        const batchKey = `${batchName}-${iterator}`

        if (!batches[batchKey]) {
          batches[batchKey] = {}
        }

        batches[batchKey][side.toLowerCase() as 'front' | 'back'] = file
      }
    })

    const batchArray = Object.entries(batches).map(([key, files]) => ({
      id: key,
      name: key,
      front: files.front,
      back: files.back,
      isComplete: !!(files.front && files.back),
      hasOrphans: !files.front || !files.back
    }))

    setDetectedBatches(batchArray)
  }, [directoryContents])

  const handleSelectAll = () => {
    const completeBatches = detectedBatches
      .filter(batch => batch.isComplete)
      .map(batch => batch.id)

    if (selectedBatches.length === completeBatches.length) {
      onBatchSelectionChange([])
    } else {
      onBatchSelectionChange(completeBatches)
    }
  }

  const handleBatchToggle = (batchId: string) => {
    if (selectedBatches.includes(batchId)) {
      onBatchSelectionChange(selectedBatches.filter(id => id !== batchId))
    } else {
      onBatchSelectionChange([...selectedBatches, batchId])
    }
  }

  const completeBatches = detectedBatches.filter(batch => batch.isComplete)
  const allSelected = completeBatches.length > 0 && selectedBatches.length === completeBatches.length

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-500" />
            Batch Selection
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={completeBatches.length === 0}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary">
            {detectedBatches.length} batches detected
          </Badge>
          <Badge variant="secondary">
            {selectedBatches.length} selected
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {detectedBatches.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No card batches detected. Ensure files follow the naming convention:<br />
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mt-2 inline-block">
                batch-001-front.jpg, batch-001-back.jpg
              </code>
            </p>
          ) : (
            detectedBatches.map((batch) => (
              <div
                key={batch.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <Checkbox
                  checked={selectedBatches.includes(batch.id)}
                  onCheckedChange={() => handleBatchToggle(batch.id)}
                  disabled={!batch.isComplete}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{batch.name}</span>
                    {batch.hasOrphans && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className={batch.front ? "text-green-600" : "text-red-600"}>
                      Front: {batch.front ? '✓' : '✗'}
                    </span>
                    <span className={batch.back ? "text-green-600" : "text-red-600"}>
                      Back: {batch.back ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
                <ImageIcon className="w-4 h-4 text-gray-400" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}