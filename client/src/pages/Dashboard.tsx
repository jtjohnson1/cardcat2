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
  const { toast } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...')
      setLoading(true)

      const [statsResponse, activityResponse] = await Promise.all([
        getDashboardStats(),
        getRecentActivity()
      ])

      console.log('Dashboard stats response:', statsResponse)
      console.log('Dashboard activity response:', activityResponse)

      // The backend returns data directly in the response, not nested under success
      setStats(statsResponse)
      setActivities(activityResponse.activities || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
          value={stats?.totalCards || 0}
          icon={<Users className="h-4 w-4" />}
          trend={stats?.cardsAddedToday > 0 ? `+${stats.cardsAddedToday} today` : undefined}
        />
        <StatsCard
          title="Total Value"
          value={`$${(stats?.totalValue || 0).toLocaleString()}`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={stats?.avgValue > 0 ? `Avg: $${Math.round(stats.avgValue)}` : undefined}
        />
        <StatsCard
          title="This Week"
          value={stats?.cardsAddedThisWeek || 0}
          icon={<Activity className="h-4 w-4" />}
          trend={stats?.cardsAddedThisMonth > 0 ? `${stats.cardsAddedThisMonth} this month` : undefined}
        />
        <StatsCard
          title="System Status"
          value={stats?.systemStatus?.status || 'Unknown'}
          icon={<Server className="h-4 w-4" />}
          trend={stats?.systemStatus?.uptime ? `Uptime: ${Math.round(stats.systemStatus.uptime / 3600)}h` : undefined}
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
                <span className="font-medium">{stats?.processingStats?.queueSize || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span className="font-medium">
                  {stats?.processingStats?.processing ? 'Processing' : 'Idle'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Processed</span>
                <span className="font-medium">
                  {stats?.processingStats?.lastProcessed || 'Never'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}