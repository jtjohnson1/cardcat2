import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { Star, TrendingUp, Award } from "lucide-react"
import { PlaceholderImage } from "@/components/ui/placeholder-image"

interface CardGridProps {
  cards: any[]
}

export function CardGrid({ cards }: CardGridProps) {
  const navigate = useNavigate()

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No cards found matching your criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card
          key={card._id}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          onClick={() => navigate(`/database/${card._id}`)}
        >
          <CardContent className="p-4">
            <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 overflow-hidden">
              {card.frontImage ? (
                <img
                  src={card.frontImage}
                  alt={`${card.playerName} card`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
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
            
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm line-clamp-2">{card.playerName}</h3>
                {card.isRookie && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    RC
                  </Badge>
                )}
              </div>
              
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>{card.year} {card.manufacturer}</p>
                <p>{card.team}</p>
                {card.set && <p className="truncate">{card.set}</p>}
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  {card.isGraded && (
                    <Award className="w-3 h-3 text-yellow-500" />
                  )}
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {card.condition}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-sm font-semibold">
                    ${card.estimatedValue?.toLocaleString() || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}