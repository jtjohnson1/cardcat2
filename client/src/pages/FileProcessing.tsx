import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Folder, Play, Pause, RotateCcw } from "lucide-react"
import { 
  getDirectoryContents, 
  startProcessing, 
  pauseProcessing, 
  resumeProcessing, 
  getProcessingStatus 
} from "@/api/processing"
import { useToast } from "@/hooks/useToast"
import { DirectoryBrowser } from "@/components/processing/DirectoryBrowser"
import { BatchSelector } from "@/components/processing/BatchSelector"
import { ProcessingMonitor } from "@/components/processing/ProcessingMonitor"

export function FileProcessing() {
  console.log('FileProcessing: Component rendering')
  
  const [currentDirectory, setCurrentDirectory] = useState('/')
  const [directoryContents, setDirectoryContents] = useState<any[]>([])
  const [selectedBatches, setSelectedBatches] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingJobId, setProcessingJobId] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    console.log('FileProcessing: useEffect triggered, loading directory:', currentDirectory)
    loadDirectory(currentDirectory)
  }, [currentDirectory])

  useEffect(() => {
    console.log('FileProcessing: Processing status effect, isProcessing:', isProcessing, 'jobId:', processingJobId)
    let interval: NodeJS.Timeout | null = null
    
    if (isProcessing && processingJobId) {
      console.log('FileProcessing: Starting status polling for job:', processingJobId)
      interval = setInterval(() => {
        loadProcessingStatus(processingJobId)
      }, 2000)
    }

    return () => {
      if (interval) {
        console.log('FileProcessing: Clearing status polling interval')
        clearInterval(interval)
      }
    }
  }, [isProcessing, processingJobId])

  const loadDirectory = async (path: string) => {
    try {
      console.log('FileProcessing: Loading directory:', path)
      setLoading(true)
      setError(null)
      
      const response = await getDirectoryContents(path)
      console.log('FileProcessing: Directory response:', response)
      
      if (response.success) {
        console.log('FileProcessing: Directory contents:', response.contents)
        // Ensure we always set an array
        setDirectoryContents(Array.isArray(response.contents) ? response.contents : [])
      } else {
        console.error('FileProcessing: Directory load failed:', response)
        setError('Failed to load directory contents')
        setDirectoryContents([])
      }
    } catch (error) {
      console.error('FileProcessing: Error loading directory:', error)
      setError(error.message || 'Failed to load directory')
      setDirectoryContents([])
      toast({
        title: "Error",
        description: error.message || "Failed to load directory",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadProcessingStatus = async (jobId: string) => {
    try {
      console.log('FileProcessing: Loading processing status for job:', jobId)
      const response = await getProcessingStatus(jobId)
      console.log('FileProcessing: Processing status response:', response)
      
      if (response.success) {
        setProcessingStatus(response.status)
        
        if (response.status.status === 'completed' || response.status.status === 'error') {
          console.log('FileProcessing: Processing finished with status:', response.status.status)
          setIsProcessing(false)
          setProcessingJobId(null)
        }
      }
    } catch (error) {
      console.error('FileProcessing: Error loading processing status:', error)
    }
  }

  const handleDirectoryChange = (newPath: string) => {
    console.log('FileProcessing: Directory change requested:', newPath)
    setCurrentDirectory(newPath)
  }

  const handleBatchSelection = (batches: string[]) => {
    console.log('FileProcessing: Batch selection changed:', batches)
    setSelectedBatches(Array.isArray(batches) ? batches : [])
  }

  const handleStartProcessing = async () => {
    if (selectedBatches.length === 0) {
      console.warn('FileProcessing: No batches selected for processing')
      toast({
        title: "No Selection",
        description: "Please select batches to process",
        variant: "destructive",
      })
      return
    }

    try {
      console.log('FileProcessing: Starting processing for batches:', selectedBatches)
      const response = await startProcessing({
        batches: selectedBatches,
        directory: currentDirectory
      })
      
      console.log('FileProcessing: Start processing response:', response)
      
      if (response.success) {
        setIsProcessing(true)
        setProcessingJobId(response.jobId)
        toast({
          title: "Processing Started",
          description: "Card processing has begun",
        })
      }
    } catch (error) {
      console.error('FileProcessing: Error starting processing:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to start processing",
        variant: "destructive",
      })
    }
  }

  const handlePauseProcessing = async () => {
    if (!processingJobId) return

    try {
      console.log('FileProcessing: Pausing processing for job:', processingJobId)
      await pauseProcessing({ jobId: processingJobId })
      toast({
        title: "Processing Paused",
        description: "Card processing has been paused",
      })
    } catch (error) {
      console.error('FileProcessing: Error pausing processing:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to pause processing",
        variant: "destructive",
      })
    }
  }

  const handleResumeProcessing = async () => {
    if (!processingJobId) return

    try {
      console.log('FileProcessing: Resuming processing for job:', processingJobId)
      await resumeProcessing({ jobId: processingJobId })
      toast({
        title: "Processing Resumed",
        description: "Card processing has been resumed",
      })
    } catch (error) {
      console.error('FileProcessing: Error resuming processing:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to resume processing",
        variant: "destructive",
      })
    }
  }

  // Ensure all props are safe before rendering
  const safeDirectoryContents = Array.isArray(directoryContents) ? directoryContents : []
  const safeSelectedBatches = Array.isArray(selectedBatches) ? selectedBatches : []

  console.log('FileProcessing: Render state:', {
    loading,
    error,
    directoryContents: safeDirectoryContents.length,
    selectedBatches: safeSelectedBatches.length,
    isProcessing,
    processingJobId,
    processingStatus
  })

  if (error) {
    console.log('FileProcessing: Rendering error state:', error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            File Processing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Process your trading card images with AI recognition
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button onClick={() => loadDirectory(currentDirectory)}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          File Processing
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Process your trading card images with AI recognition
        </p>
      </div>

      {/* Directory Browser */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Directory Browser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DirectoryBrowser
            currentDirectory={currentDirectory}
            contents={safeDirectoryContents}
            onDirectoryChange={handleDirectoryChange}
            loading={loading}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Batch Selection */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle>Batch Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <BatchSelector
            contents={safeDirectoryContents}
            selectedBatches={safeSelectedBatches}
            onBatchSelection={handleBatchSelection}
          />
        </CardContent>
      </Card>

      {/* Processing Controls */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle>Processing Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleStartProcessing}
              disabled={safeSelectedBatches.length === 0 || isProcessing}
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Processing ({safeSelectedBatches.length} batches)
            </Button>

            {isProcessing && (
              <>
                <Button
                  variant="outline"
                  onClick={handlePauseProcessing}
                  disabled={processingStatus?.status === 'paused'}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>

                <Button
                  variant="outline"
                  onClick={handleResumeProcessing}
                  disabled={processingStatus?.status !== 'paused'}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Monitor */}
      {isProcessing && processingStatus && (
        <ProcessingMonitor
          status={processingStatus}
          onPause={handlePauseProcessing}
          onResume={handleResumeProcessing}
        />
      )}
    </div>
  )
}