import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Star, TrendingUp, Award, Eye, Edit } from "lucide-react"
import { PlaceholderImage } from "@/components/ui/placeholder-image"

interface CardListProps {
  cards: any[]
}

export function CardList({ cards }: CardListProps) {
  const navigate = useNavigate()

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No cards found matching your criteria</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <Card
          key={card._id}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                {card.frontImage ? (
                  <img
                    src={card.frontImage}
                    alt={`${card.playerName} card`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <PlaceholderImage 
                  className={`w-full h-full rounded-lg ${card.frontImage ? 'hidden' : ''}`}
                  alt={`${card.playerName} card placeholder`}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{card.playerName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {card.year} {card.manufacturer} • {card.team}
                    </p>
                    {card.set && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">{card.set}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {card.isRookie && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Rookie
                      </Badge>
                    )}
                    {card.isGraded && (
                      <Badge variant="outline" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        Graded
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Condition: <span className="font-medium">{card.condition}</span>
                    </span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">
                        ${card.estimatedValue?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/database/${card._id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}