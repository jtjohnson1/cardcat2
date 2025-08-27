import { Button } from "@/components/ui/button"
import { Upload, Database, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => navigate('/processing')}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
      >
        <Upload className="w-4 h-4 mr-2" />
        Process Cards
      </Button>
      <Button
        variant="outline"
        onClick={() => navigate('/database')}
        className="border-gray-200 dark:border-gray-700"
      >
        <Database className="w-4 h-4 mr-2" />
        View Database
      </Button>
    </div>
  )
}