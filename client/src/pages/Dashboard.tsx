import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, TrendingUp, Server } from "lucide-react"
import { getDashboardStats, getRecentActivity } from "@/api/dashboard"
import { useToast } from "@/hooks/useToast"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { QuickActions } from "@/components/dashboard/QuickActions"

export function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true;
    
    const loadDashboardData = async () => {
      try {
        console.log('Dashboard: Loading data...')
        setLoading(true)
        setError(null)

        const [statsResponse, activityResponse] = await Promise.all([
          getDashboardStats(),
          getRecentActivity()
        ])

        if (!mounted) return; // Prevent state updates if component unmounted

        console.log('Dashboard: Stats response:', statsResponse)
        console.log('Dashboard: Activity response:', activityResponse)

        // Ensure we have valid data structures
        const safeStats = statsResponse || {}
        const safeActivities = Array.isArray(activityResponse?.activities) 
          ? activityResponse.activities 
          : []

        setStats(safeStats)
        setActivities(safeActivities)
      } catch (error) {
        console.error('Dashboard: Error loading data:', error)
        if (mounted) {
          setError(error.message || 'Failed to load dashboard data')
          toast({
            title: "Error",
            description: "Failed to load dashboard data",
            variant: "destructive",
          })
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      mounted = false;
    }
  }, [toast])

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of your trading card collection
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of your trading card collection
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Ensure stats is an object before rendering
  const safeStats = stats || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of your trading card collection
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Cards"
          value={safeStats.totalCards || 0}
          icon={<Users className="h-4 w-4" />}
          trend={safeStats.cardsAddedToday > 0 ? `+${safeStats.cardsAddedToday} today` : undefined}
        />
        <StatsCard
          title="Total Value"
          value={`$${(safeStats.totalValue || 0).toLocaleString()}`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={safeStats.avgValue > 0 ? `Avg: $${Math.round(safeStats.avgValue)}` : undefined}
        />
        <StatsCard
          title="This Week"
          value={safeStats.cardsAddedThisWeek || 0}
          icon={<Activity className="h-4 w-4" />}
          trend={safeStats.cardsAddedThisMonth > 0 ? `${safeStats.cardsAddedThisMonth} this month` : undefined}
        />
        <StatsCard
          title="System Status"
          value={safeStats.systemStatus?.status || 'Healthy'}
          icon={<Server className="h-4 w-4" />}
          trend={safeStats.systemStatus?.uptime ? `Uptime: ${Math.round(safeStats.systemStatus.uptime / 3600)}h` : undefined}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={activities} />
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle>Processing Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Queue Size</span>
                <span className="font-medium">{safeStats.processingStats?.queueSize || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span className="font-medium">
                  {safeStats.processingStats?.processing ? 'Processing' : 'Idle'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Processed</span>
                <span className="font-medium">
                  {safeStats.processingStats?.lastProcessed || 'Never'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}