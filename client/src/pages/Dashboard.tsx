import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, TrendingUp, Server } from "lucide-react"
import { getDashboardStats, getRecentActivity } from "@/api/dashboard"
import { useToast } from "@/hooks/useToast"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { QuickActions } from "@/components/dashboard/QuickActions"

export function Dashboard() {
  console.log('Dashboard: Component function called')
  
  const [stats, setStats] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  console.log('Dashboard: State initialized - loading:', loading, 'error:', error, 'stats:', stats, 'activities:', activities)
  
  const { toast } = useToast()
  console.log('Dashboard: useToast hook called')

  useEffect(() => {
    console.log('Dashboard: useEffect triggered')
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        console.log('Dashboard: loadDashboardData started')
        setLoading(true)
        console.log('Dashboard: setLoading(true) called')
        setError(null)
        console.log('Dashboard: setError(null) called')

        console.log('Dashboard: About to make API calls')
        const [statsResponse, activityResponse] = await Promise.all([
          getDashboardStats(),
          getRecentActivity()
        ])
        console.log('Dashboard: API calls completed')

        if (!mounted) {
          console.log('Dashboard: Component unmounted, skipping state updates')
          return;
        }

        console.log('Dashboard: Processing API responses')
        console.log('Dashboard: statsResponse:', JSON.stringify(statsResponse, null, 2))
        console.log('Dashboard: activityResponse:', JSON.stringify(activityResponse, null, 2))

        // Ensure we have valid data structures
        const safeStats = statsResponse || {}
        const safeActivities = Array.isArray(activityResponse?.activities)
          ? activityResponse.activities
          : []

        console.log('Dashboard: safeStats:', JSON.stringify(safeStats, null, 2))
        console.log('Dashboard: safeActivities:', JSON.stringify(safeActivities, null, 2))

        console.log('Dashboard: About to call setStats')
        setStats(safeStats)
        console.log('Dashboard: setStats called')
        
        console.log('Dashboard: About to call setActivities')
        setActivities(safeActivities)
        console.log('Dashboard: setActivities called')
        
      } catch (error) {
        console.error('Dashboard: Error in loadDashboardData:', error)
        console.error('Dashboard: Error stack:', error.stack)
        if (mounted) {
          console.log('Dashboard: Setting error state')
          setError(error.message || 'Failed to load dashboard data')
          console.log('Dashboard: Showing toast')
          toast({
            title: "Error",
            description: "Failed to load dashboard data",
            variant: "destructive",
          })
        }
      } finally {
        if (mounted) {
          console.log('Dashboard: Setting loading to false')
          setLoading(false)
          console.log('Dashboard: Loading set to false')
        }
      }
    }

    console.log('Dashboard: Calling loadDashboardData')
    loadDashboardData()

    return () => {
      console.log('Dashboard: useEffect cleanup called')
      mounted = false;
    }
  }, [toast])

  console.log('Dashboard: Render phase - loading:', loading, 'error:', error, 'stats:', stats)

  if (error) {
    console.log('Dashboard: Rendering error state')
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
    console.log('Dashboard: Rendering loading state')
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard - Loading...
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

  console.log('Dashboard: About to render main content')
  
  // Ensure stats is an object before rendering
  const safeStats = stats || {}
  console.log('Dashboard: safeStats for render:', safeStats)

  try {
    console.log('Dashboard: Starting main render')
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard - Loaded
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
  } catch (renderError) {
    console.error('Dashboard: Error during render:', renderError)
    console.error('Dashboard: Render error stack:', renderError.stack)
    return (
      <div className="p-4">
        <h1>Dashboard Render Error</h1>
        <p>Error: {renderError.message}</p>
        <pre>{renderError.stack}</pre>
      </div>
    )
  }
}