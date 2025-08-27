import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { FileProcessing } from "./pages/FileProcessing"
import { CardDatabase } from "./pages/CardDatabase"
import { Settings } from "./pages/Settings"
import { CardDetail } from "./pages/CardDetail"

function App() {
  console.log('App: Component rendering')
  
  try {
    return (
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={
                <>
                  {console.log('App: Rendering Dashboard route')}
                  <Dashboard />
                </>
              } />
              <Route path="processing" element={<FileProcessing />} />
              <Route path="database" element={<CardDatabase />} />
              <Route path="database/:cardId" element={<CardDetail />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    )
  } catch (error) {
    console.error('App: Error in App component:', error)
    return (
      <div className="p-4">
        <h1>App Error</h1>
        <p>Error: {error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    )
  }
}

export default App