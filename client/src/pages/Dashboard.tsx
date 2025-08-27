import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Database, 
  Clock, 
  Activity,
  Upload,
  Eye
} from "lucide-react"
import { getDashboardStats, getRecentActivity } from "@/api/dashboard"
import { useToast } from "@/hooks/useToast"
import { useNavigate } from "react-router-dom"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { QuickActions } from "@/components/dashboard/QuickActions"

export function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Loading dashboard data...')
        const [statsData, activityData] = await Promise.all([
          getDashboardStats(),
          getRecentActivity()
        ])
        setStats(statsData)
        setActivity(activityData.activities)
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

    loadDashboardData()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your trading card overview.
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Cards"
          value={stats?.totalCards || 0}
          icon={Database}
          trend={stats?.cardsTrend}
          color="blue"
        />
        <StatsCard
          title="Cards Processed Today"
          value={stats?.cardsProcessedToday || 0}
          icon={TrendingUp}
          trend={stats?.processingTrend}
          color="green"
        />
        <StatsCard
          title="Processing Queue"
          value={stats?.queueSize || 0}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="System Status"
          value={stats?.systemStatus || "Online"}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed activities={activity} />
        
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Processing Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cards per minute</span>
                <span className="font-semibold">{stats?.processingSpeed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Success rate</span>
                <span className="font-semibold text-green-600">{stats?.successRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average processing time</span>
                <span className="font-semibold">{stats?.avgProcessingTime || 0}s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}