import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from "lucide-react"
import { getCards, searchCards } from "@/api/cards"
import { useToast } from "@/hooks/useToast"
import { SearchFilters } from "@/components/database/SearchFilters"
import { CardGrid } from "@/components/database/CardGrid"
import { CardList } from "@/components/database/CardList"

export function CardDatabase() {
  const [cards, setCards] = useState<any[]>([])
  const [filteredCards, setFilteredCards] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('dateAdded')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCards()
  }, [])

  useEffect(() => {
    applyFiltersAndSearch()
  }, [cards, searchQuery, filters, sortBy, sortOrder])

  const loadCards = async () => {
    try {
      console.log('Loading cards...')
      const cardsData = await getCards()
      setCards(cardsData.cards)
    } catch (error) {
      console.error('Error loading cards:', error)
      toast({
        title: "Error",
        description: "Failed to load cards",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSearch = () => {
    let filtered = [...cards]

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(card =>
        card.playerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.team?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.set?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply filters
    if (filters.sport) {
      filtered = filtered.filter(card => card.sport === filters.sport)
    }
    if (filters.year) {
      filtered = filtered.filter(card => card.year >= filters.year.min && card.year <= filters.year.max)
    }
    if (filters.manufacturer) {
      filtered = filtered.filter(card => filters.manufacturer.includes(card.manufacturer))
    }
    if (filters.condition) {
      filtered = filtered.filter(card => filters.condition.includes(card.condition))
    }
    if (filters.priceRange) {
      filtered = filtered.filter(card => 
        card.estimatedValue >= filters.priceRange.min && 
        card.estimatedValue <= filters.priceRange.max
      )
    }
    if (filters.rookieOnly) {
      filtered = filtered.filter(card => card.isRookie)
    }
    if (filters.gradedOnly) {
      filtered = filtered.filter(card => card.isGraded)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredCards(filtered)
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      try {
        const results = await searchCards({ query })
        setFilteredCards(results.cards)
      } catch (error) {
        console.error('Error searching cards:', error)
      }
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
                onFiltersChange={setFilters}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCards.length} of {cards.length} cards
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1 bg-white dark:bg-gray-800"
        >
          <option value="dateAdded">Date Added</option>
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
    </div>
  )
}