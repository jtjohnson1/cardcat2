import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Award, Calendar, MapPin, Hash, Trophy } from "lucide-react"

interface CardInfoProps {
  card: any
}

export function CardInfo({ card }: CardInfoProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-500" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Player</label>
              <p className="font-semibold">{card.playerName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Team</label>
              <p className="font-semibold">{card.team}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Year</label>
              <p className="font-semibold">{card.year}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Sport</label>
              <p className="font-semibold">{card.sport}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Manufacturer</label>
              <p className="font-semibold">{card.manufacturer}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Set</label>
              <p className="font-semibold">{card.set}</p>
            </div>
            {card.cardNumber && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Card Number</label>
                <p className="font-semibold">#{card.cardNumber}</p>
              </div>
            )}
            {card.serialNumber && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Serial Number</label>
                <p className="font-semibold">{card.serialNumber}</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {card.isRookie && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                Rookie Card
              </Badge>
            )}
            {card.isGraded && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                Graded
              </Badge>
            )}
            {card.isParallel && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Parallel
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {card.notes && (
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle>Personal Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">{card.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}