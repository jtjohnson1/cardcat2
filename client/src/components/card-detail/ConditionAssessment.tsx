import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Eye, AlertTriangle, CheckCircle } from "lucide-react"

interface ConditionAssessmentProps {
  card: any
}

export function ConditionAssessment({ card }: ConditionAssessmentProps) {
  const conditionScore = card.conditionScore || 85
  const centeringScore = card.centeringScore || 90
  const cornersScore = card.cornersScore || 80
  const edgesScore = card.edgesScore || 85
  const surfaceScore = card.surfaceScore || 88

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            AI Condition Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{card.condition}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Overall Grade: {conditionScore}/100
            </div>
            <Progress value={conditionScore} className="mt-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Centering</span>
                <span className="text-sm text-gray-600">{centeringScore}/100</span>
              </div>
              <Progress value={centeringScore} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Corners</span>
                <span className="text-sm text-gray-600">{cornersScore}/100</span>
              </div>
              <Progress value={cornersScore} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Edges</span>
                <span className="text-sm text-gray-600">{edgesScore}/100</span>
              </div>
              <Progress value={edgesScore} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Surface</span>
                <span className="text-sm text-gray-600">{surfaceScore}/100</span>
              </div>
              <Progress value={surfaceScore} />
            </div>
          </div>
        </CardContent>
      </Card>

      {card.conditionNotes && (
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle>Condition Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {card.conditionNotes.map((note: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  {note.severity === 'minor' ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{note.issue}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{note.description}</p>
                  </div>
                  <Badge variant={note.severity === 'minor' ? 'secondary' : 'destructive'} className="text-xs">
                    {note.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}