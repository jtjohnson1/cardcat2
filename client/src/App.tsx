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
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
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
}

export default App