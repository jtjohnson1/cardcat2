import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Plus
} from "lucide-react"
import { getCards, searchCards, createCard } from "@/api/cards"
import { useToast } from "@/hooks/useToast"
import { SearchFilters } from "@/components/database/SearchFilters"
import { CardGrid } from "@/components/database/CardGrid"
import { CardList } from "@/components/database/CardList"

export function CardDatabase() {
  const [cards, setCards] = useState<any[]>([])
  const [filteredCards, setFilteredCards] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newCard, setNewCard] = useState({
    playerName: '',
    team: '',
    year: new Date().getFullYear(),
    sport: '',
    manufacturer: '',
    set: '',
    cardNumber: '',
    condition: 'Near Mint',
    notes: '',
    status: 'active'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const { toast } = useToast()

  useEffect(() => {
    loadCards()
  }, [filters, sortBy, sortOrder, pagination.page])

  const loadCards = async () => {
    try {
      console.log('Loading cards...')
      setLoading(true)
      const response = await getCards(filters, {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder
      })

      if (response.success) {
        setCards(response.cards)
        setFilteredCards(response.cards)
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            ...response.pagination
          }))
        }
      }
    } catch (error) {
      console.error('Error loading cards:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to load cards",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      try {
        const response = await searchCards({ query })
        if (response.success) {
          setFilteredCards(response.cards)
        }
      } catch (error) {
        console.error('Error searching cards:', error)
        toast({
          title: "Error",
          description: error.message || "Failed to search cards",
          variant: "destructive",
        })
      }
    } else if (query.length === 0) {
      setFilteredCards(cards)
    }
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleCreateCard = async () => {
    try {
      setCreating(true)
      console.log('Creating card:', newCard)
      
      // Validate required fields
      if (!newCard.playerName || !newCard.team || !newCard.sport || !newCard.manufacturer || !newCard.set || !newCard.cardNumber) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const response = await createCard(newCard)
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Card created successfully",
        })
        setShowCreateDialog(false)
        setNewCard({
          playerName: '',
          team: '',
          year: new Date().getFullYear(),
          sport: '',
          manufacturer: '',
          set: '',
          cardNumber: '',
          condition: 'Near Mint',
          notes: '',
          status: 'active'
        })
        loadCards() // Reload the cards list
      }
    } catch (error) {
      console.error('Error creating card:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create card",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Card Database
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and explore your trading card collection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Card</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newCard.playerName}
                    onChange={(e) => setNewCard({ ...newCard, playerName: e.target.value })}
                    placeholder="Player name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Team *</Label>
                  <Input
                    id="team"
                    value={newCard.team}
                    onChange={(e) => setNewCard({ ...newCard, team: e.target.value })}
                    placeholder="Team name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newCard.year}
                    onChange={(e) => setNewCard({ ...newCard, year: parseInt(e.target.value) })}
                    min="1800"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport *</Label>
                  <Select value={newCard.sport} onValueChange={(value) => setNewCard({ ...newCard, sport: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Hockey">Hockey</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input
                    id="manufacturer"
                    value={newCard.manufacturer}
                    onChange={(e) => setNewCard({ ...newCard, manufacturer: e.target.value })}
                    placeholder="e.g., Topps, Panini"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="set">Set *</Label>
                  <Input
                    id="set"
                    value={newCard.set}
                    onChange={(e) => setNewCard({ ...newCard, set: e.target.value })}
                    placeholder="Card set name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    value={newCard.cardNumber}
                    onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                    placeholder="e.g., #1, RC-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={newCard.condition} onValueChange={(value) => setNewCard({ ...newCard, condition: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mint">Mint</SelectItem>
                      <SelectItem value="Near Mint">Near Mint</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Very Good">Very Good</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newCard.status} onValueChange={(value) => setNewCard({ ...newCard, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="trading">For Trade</SelectItem>
                      <SelectItem value="personal">Personal Collection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCard.notes}
                    onChange={(e) => setNewCard({ ...newCard, notes: e.target.value })}
                    placeholder="Additional notes about the card"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCard} disabled={creating}>
                  {creating ? "Creating..." : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by player, team, or set..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
          {showFilters && (
            <div className="mt-4">
              <SearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCards.length} of {pagination.total} cards
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1 bg-white dark:bg-gray-800"
        >
          <option value="createdAt">Date Added</option>
          <option value="playerName">Player Name</option>
          <option value="year">Year</option>
          <option value="estimatedValue">Value</option>
          <option value="condition">Condition</option>
        </select>
      </div>

      {/* Cards Display */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <CardGrid cards={filteredCards} />
      ) : (
        <CardList cards={filteredCards} />
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}