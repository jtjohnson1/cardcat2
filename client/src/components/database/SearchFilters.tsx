import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface SearchFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
}

const sports = ['Baseball', 'Basketball', 'Football', 'Hockey', 'Soccer']
const manufacturers = ['Topps', 'Panini', 'Upper Deck', 'Bowman', 'Donruss']
const conditions = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor']

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [yearRange, setYearRange] = useState([1950, 2024])
  const [priceRange, setPriceRange] = useState([0, 10000])

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const toggleArrayFilter = (key: string, value: string) => {
    const current = filters[key] || []
    const updated = current.includes(value)
      ? current.filter((item: string) => item !== value)
      : [...current, value]
    updateFilter(key, updated)
  }

  const clearFilters = () => {
    onFiltersChange({})
    setYearRange([1950, 2024])
    setPriceRange([0, 10000])
  }

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key]
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object' && value !== null) return true
      return Boolean(value)
    }).length
  }

  return (
    <Card className="bg-gray-50/50 dark:bg-gray-800/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Filters</h3>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()} active</Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sport */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sport</Label>
            <div className="space-y-2">
              {sports.map(sport => (
                <div key={sport} className="flex items-center space-x-2">
                  <Checkbox
                    id={sport}
                    checked={filters.sport === sport}
                    onCheckedChange={(checked) => 
                      updateFilter('sport', checked ? sport : null)
                    }
                  />
                  <Label htmlFor={sport} className="text-sm">{sport}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Year Range ({yearRange[0]} - {yearRange[1]})
            </Label>
            <Slider
              value={yearRange}
              onValueChange={(value) => {
                setYearRange(value)
                updateFilter('year', { min: value[0], max: value[1] })
              }}
              min={1950}
              max={2024}
              step={1}
              className="w-full"
            />
          </div>

          {/* Manufacturer */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Manufacturer</Label>
            <div className="space-y-2">
              {manufacturers.map(manufacturer => (
                <div key={manufacturer} className="flex items-center space-x-2">
                  <Checkbox
                    id={manufacturer}
                    checked={(filters.manufacturer || []).includes(manufacturer)}
                    onCheckedChange={() => toggleArrayFilter('manufacturer', manufacturer)}
                  />
                  <Label htmlFor={manufacturer} className="text-sm">{manufacturer}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Condition & Special */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Condition</Label>
              <div className="space-y-2">
                {conditions.slice(0, 4).map(condition => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      checked={(filters.condition || []).includes(condition)}
                      onCheckedChange={() => toggleArrayFilter('condition', condition)}
                    />
                    <Label htmlFor={condition} className="text-sm">{condition}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rookie"
                  checked={filters.rookieOnly || false}
                  onCheckedChange={(checked) => updateFilter('rookieOnly', checked)}
                />
                <Label htmlFor="rookie" className="text-sm">Rookie Cards Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="graded"
                  checked={filters.gradedOnly || false}
                  onCheckedChange={(checked) => updateFilter('gradedOnly', checked)}
                />
                <Label htmlFor="graded" className="text-sm">Graded Cards Only</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="mt-6 space-y-3">
          <Label className="text-sm font-medium">
            Price Range (${priceRange[0]} - ${priceRange[1]})
          </Label>
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              setPriceRange(value)
              updateFilter('priceRange', { min: value[0], max: value[1] })
            }}
            min={0}
            max={10000}
            step={50}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}