import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Star,
  Award,
  TrendingUp,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Bell,
  ExternalLink
} from "lucide-react"
import { getCard, deleteCard } from "@/api/cards"
import { useToast } from "@/hooks/useToast"
import { CardImages } from "@/components/card-detail/CardImages"
import { PriceAnalysis } from "@/components/card-detail/PriceAnalysis"
import { CardInfo } from "@/components/card-detail/CardInfo"
import { ConditionAssessment } from "@/components/card-detail/ConditionAssessment"

export function CardDetail() {
  const { cardId } = useParams()
  const navigate = useNavigate()
  const [card, setCard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (cardId) {
      loadCard(cardId)
    }
  }, [cardId])

  const loadCard = async (id: string) => {
    try {
      console.log('Loading card:', id)
      const cardData = await getCard(id)
      setCard(cardData)
    } catch (error) {
      console.error('Error loading card:', error)
      toast({
        title: "Error",
        description: "Failed to load card details",
        variant: "destructive",
      })
      navigate('/database')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!card || !window.confirm('Are you sure you want to delete this card?')) return

    try {
      await deleteCard(card._id)
      toast({
        title: "Card deleted",
        description: "The card has been removed from your collection",
      })
      navigate('/database')
    } catch (error) {
      console.error('Error deleting card:', error)
      toast({
        title: "Error",
        description: "Failed to delete card",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Card not found</p>
        <Button onClick={() => navigate('/database')} className="mt-4">
          Back to Database
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/database')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {card.playerName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {card.year} {card.manufacturer} • {card.set}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Price Alert
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Images */}
        <div className="lg:col-span-1">
          <CardImages card={card} />
        </div>

        {/* Card Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="condition">Condition</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <CardInfo card={card} />
            </TabsContent>

            <TabsContent value="condition">
              <ConditionAssessment card={card} />
            </TabsContent>

            <TabsContent value="pricing">
              <PriceAnalysis card={card} />
            </TabsContent>

            <TabsContent value="market">
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle>Market Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Market analysis features coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}