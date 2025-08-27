import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
            {trend && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {trend}
              </p>
            )}
          </div>
          <div className="text-gray-400 dark:text-gray-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}