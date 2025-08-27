import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from "lucide-react"
import { getProcessingStatus, pauseProcessing, resumeProcessing } from "@/api/processing"
import { useToast } from "@/hooks/useToast"
import { PlaceholderImage } from "@/components/ui/placeholder-image"

interface ProcessingMonitorProps {
  onProcessingComplete: () => void
}

export function ProcessingMonitor({ onProcessingComplete }: ProcessingMonitorProps) {
  const [status, setStatus] = useState<any>(null)
  const [isPaused, setIsPaused] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const statusData = await getProcessingStatus()
        setStatus(statusData)
        
        if (statusData.isComplete) {
          onProcessingComplete()
          clearInterval(interval)
          toast({
            title: "Processing Complete",
            description: `Processed ${statusData.totalCards} cards successfully`,
          })
        }
      } catch (error) {
        console.error('Error fetching processing status:', error)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [onProcessingComplete, toast])

  const handlePauseResume = async () => {
    try {
      if (isPaused) {
        await resumeProcessing()
        setIsPaused(false)
        toast({
          title: "Processing Resumed",
          description: "Card processing has been resumed",
        })
      } else {
        await pauseProcessing()
        setIsPaused(true)
        toast({
          title: "Processing Paused",
          description: "Card processing has been paused",
        })
      }
    } catch (error) {
      console.error('Error pausing/resuming processing:', error)
      toast({
        title: "Error",
        description: "Failed to pause/resume processing",
        variant: "destructive",
      })
    }
  }

  if (!status) {
    return (
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Initializing processing...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Processing Monitor
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePauseResume}
            className="flex items-center gap-2"
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{status.processed}/{status.total} cards</span>
          </div>
          <Progress value={(status.processed / status.total) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{Math.round((status.processed / status.total) * 100)}% complete</span>
            <span>ETA: {status.estimatedTimeRemaining}</span>
          </div>
        </div>

        {/* Current Processing */}
        {status.currentCard && (
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
              {status.currentCard.thumbnail ? (
                <img
                  src={status.currentCard.thumbnail}
                  alt="Current card"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              <PlaceholderImage 
                className={`w-full h-full rounded-lg ${status.currentCard.thumbnail ? 'hidden' : ''}`}
                alt="Current card placeholder"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">Processing: {status.currentCard.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analyzing card details and condition...
              </p>
            </div>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-lg font-bold">{status.successful}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Successful</p>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-lg font-bold">{status.failed}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Failed</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-bold">{status.speed}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Cards/min</p>
          </div>
        </div>

        {/* Error Log */}
        {status.errors && status.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-600">Recent Errors</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {status.errors.map((error: any, index: number) => (
                <div key={index} className="text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-300">
                  {error.message} - {error.cardName}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}