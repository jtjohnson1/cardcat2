import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, ExternalLink, Calendar } from "lucide-react"

interface PriceAnalysisProps {
  card: any
}

export function PriceAnalysis({ card }: PriceAnalysisProps) {
  const priceHistory = card.priceHistory || []
  const recentSales = card.recentSales || []
  const currentPrice = card.estimatedValue || 0
  const priceChange = card.priceChange || 0

  return (
    <div className="space-y-6">
      {/* Current Value */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Current Market Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">
                ${currentPrice.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange}% (30 days)
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Last Updated</div>
              <div className="text-sm font-medium">
                {new Date(card.lastPriceUpdate || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Recent Sales
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on eBay
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSales.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No recent sales data available
            </p>
          ) : (
            <div className="space-y-3">
              {recentSales.map((sale: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-medium">${sale.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sale.condition} • {sale.platform}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(sale.date).toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {sale.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Comparison */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle>Price Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">TCGPlayer</p>
              <p className="text-lg font-bold">${card.tcgPlayerPrice || 'N/A'}</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">eBay Average</p>
              <p className="text-lg font-bold">${card.ebayAverage || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}