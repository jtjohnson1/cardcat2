import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"

export function Layout() {
  console.log('Layout: Component rendering')
  
  try {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {console.log('Layout: About to render Outlet')}
            <Outlet />
            {console.log('Layout: Outlet rendered')}
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Layout: Error in Layout component:', error)
    return (
      <div className="p-4">
        <h1>Layout Error</h1>
        <p>Error: {error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    )
  }
}