import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  FolderOpen, 
  Upload, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle,
  Image as ImageIcon,
  FileImage
} from "lucide-react"
import { getDirectoryContents, startProcessing, getProcessingStatus } from "@/api/processing"
import { useToast } from "@/hooks/useToast"
import { DirectoryBrowser } from "@/components/processing/DirectoryBrowser"
import { BatchSelector } from "@/components/processing/BatchSelector"
import { ProcessingMonitor } from "@/components/processing/ProcessingMonitor"

export function FileProcessing() {
  const [currentDirectory, setCurrentDirectory] = useState<string>('')
  const [directoryContents, setDirectoryContents] = useState<any[]>([])
  const [selectedBatches, setSelectedBatches] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadDirectory('/')
  }, [])

  const loadDirectory = async (path: string) => {
    try {
      setLoading(true)
      console.log('Loading directory:', path)
      const contents = await getDirectoryContents(path)
      setDirectoryContents(contents.files)
      setCurrentDirectory(path)
    } catch (error) {
      console.error('Error loading directory:', error)
      toast({
        title: "Error",
        description: "Failed to load directory contents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartProcessing = async () => {
    if (selectedBatches.length === 0) {
      toast({
        title: "No batches selected",
        description: "Please select at least one batch to process",
        variant: "destructive",
      })
      return
    }

    try {
      console.log('Starting processing for batches:', selectedBatches)
      await startProcessing({ batches: selectedBatches, directory: currentDirectory })
      setIsProcessing(true)
      toast({
        title: "Processing started",
        description: `Started processing ${selectedBatches.length} batches`,
      })
    } catch (error) {
      console.error('Error starting processing:', error)
      toast({
        title: "Error",
        description: "Failed to start processing",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            File Processing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Process trading card images with AI-powered recognition
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleStartProcessing}
            disabled={selectedBatches.length === 0 || isProcessing}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Processing
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Directory Browser */}
        <DirectoryBrowser
          currentDirectory={currentDirectory}
          directoryContents={directoryContents}
          loading={loading}
          onDirectoryChange={loadDirectory}
        />

        {/* Batch Selection */}
        <BatchSelector
          directoryContents={directoryContents}
          selectedBatches={selectedBatches}
          onBatchSelectionChange={setSelectedBatches}
        />
      </div>

      {/* Processing Monitor */}
      {isProcessing && (
        <ProcessingMonitor
          onProcessingComplete={() => setIsProcessing(false)}
        />
      )}
    </div>
  )
}