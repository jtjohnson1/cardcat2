import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Settings as SettingsIcon,
  Database,
  Zap,
  ShoppingCart,
  Globe,
  CheckCircle,
  XCircle,
  Save,
  TestTube
} from "lucide-react"
import { getSettings, updateSettings, testConnection } from "@/api/settings"
import { useToast } from "@/hooks/useToast"

export function Settings() {
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<any>({})
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      console.log('Loading settings...')
      const settingsData = await getSettings()
      setSettings(settingsData)
      setConnectionStatus(settingsData.connectionStatus || {})
    } catch (error) {
      console.error('Error loading settings:', error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: string, data: any) => {
    try {
      setSaving(true)
      console.log('Saving settings for section:', section)
      await updateSettings({ section, data })
      setSettings({ ...settings, [section]: data })
      toast({
        title: "Settings saved",
        description: `${section} settings have been updated successfully`,
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async (service: string) => {
    try {
      console.log('Testing connection for:', service)
      const result = await testConnection(service)
      setConnectionStatus({
        ...connectionStatus,
        [service]: result.status
      })
      toast({
        title: result.status === 'connected' ? "Connection successful" : "Connection failed",
        description: result.message,
        variant: result.status === 'connected' ? "default" : "destructive",
      })
    } catch (error) {
      console.error('Error testing connection:', error)
      toast({
        title: "Connection test failed",
        description: "Unable to test connection",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
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
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure your CardCat system integrations and preferences
        </p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* eBay Integration */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-500" />
                    eBay Integration
                  </div>
                  <Badge variant={connectionStatus.ebay === 'connected' ? 'default' : 'destructive'}>
                    {connectionStatus.ebay === 'connected' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {connectionStatus.ebay || 'Not Connected'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ebay-app-id">App ID</Label>
                  <Input
                    id="ebay-app-id"
                    type="password"
                    value={settings.ebay?.appId || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      ebay: { ...settings.ebay, appId: e.target.value }
                    })}
                    placeholder="Enter your eBay App ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ebay-cert-id">Cert ID</Label>
                  <Input
                    id="ebay-cert-id"
                    type="password"
                    value={settings.ebay?.certId || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      ebay: { ...settings.ebay, certId: e.target.value }
                    })}
                    placeholder="Enter your eBay Cert ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ebay-dev-id">Dev ID</Label>
                  <Input
                    id="ebay-dev-id"
                    type="password"
                    value={settings.ebay?.devId || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      ebay: { ...settings.ebay, devId: e.target.value }
                    })}
                    placeholder="Enter your eBay Dev ID"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSave('ebay', settings.ebay)}
                    disabled={saving}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('ebay')}
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* TCGPlayer Integration */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    TCGPlayer Integration
                  </div>
                  <Badge variant={connectionStatus.tcgplayer === 'connected' ? 'default' : 'destructive'}>
                    {connectionStatus.tcgplayer === 'connected' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {connectionStatus.tcgplayer || 'Not Connected'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tcg-public-key">Public Key</Label>
                  <Input
                    id="tcg-public-key"
                    type="password"
                    value={settings.tcgplayer?.publicKey || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      tcgplayer: { ...settings.tcgplayer, publicKey: e.target.value }
                    })}
                    placeholder="Enter your TCGPlayer Public Key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tcg-private-key">Private Key</Label>
                  <Input
                    id="tcg-private-key"
                    type="password"
                    value={settings.tcgplayer?.privateKey || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      tcgplayer: { ...settings.tcgplayer, privateKey: e.target.value }
                    })}
                    placeholder="Enter your TCGPlayer Private Key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tcg-partner-key">Partner Key</Label>
                  <Input
                    id="tcg-partner-key"
                    type="password"
                    value={settings.tcgplayer?.partnerKey || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      tcgplayer: { ...settings.tcgplayer, partnerKey: e.target.value }
                    })}
                    placeholder="Enter your TCGPlayer Partner Key"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSave('tcgplayer', settings.tcgplayer)}
                    disabled={saving}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('tcgplayer')}
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-500" />
                  MongoDB Configuration
                </div>
                <Badge variant={connectionStatus.mongodb === 'connected' ? 'default' : 'destructive'}>
                  {connectionStatus.mongodb === 'connected' ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {connectionStatus.mongodb || 'Not Connected'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mongo-uri">Connection String</Label>
                <Input
                  id="mongo-uri"
                  type="password"
                  value={settings.mongodb?.uri || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    mongodb: { ...settings.mongodb, uri: e.target.value }
                  })}
                  placeholder="mongodb://localhost:27017/cardcat"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mongo-database">Database Name</Label>
                <Input
                  id="mongo-database"
                  value={settings.mongodb?.database || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    mongodb: { ...settings.mongodb, database: e.target.value }
                  })}
                  placeholder="cardcat"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSave('mongodb', settings.mongodb)}
                  disabled={saving}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestConnection('mongodb')}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Ollama AI Configuration
                </div>
                <Badge variant={connectionStatus.ollama === 'connected' ? 'default' : 'destructive'}>
                  {connectionStatus.ollama === 'connected' ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {connectionStatus.ollama || 'Not Connected'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ollama-endpoint">Ollama Endpoint</Label>
                <Input
                  id="ollama-endpoint"
                  value={settings.ollama?.endpoint || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    ollama: { ...settings.ollama, endpoint: e.target.value }
                  })}
                  placeholder="http://localhost:11434"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ollama-model">Vision Model</Label>
                <select
                  id="ollama-model"
                  value={settings.ollama?.model || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    ollama: { ...settings.ollama, model: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="">Select a model</option>
                  <option value="llava">LLaVA</option>
                  <option value="bakllava">BakLLaVA</option>
                  <option value="llava-phi3">LLaVA Phi3</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confidence-threshold">Confidence Threshold (%)</Label>
                <Input
                  id="confidence-threshold"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.ollama?.confidenceThreshold || 85}
                  onChange={(e) => setSettings({
                    ...settings,
                    ollama: { ...settings.ollama, confidenceThreshold: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSave('ollama', settings.ollama)}
                  disabled={saving}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestConnection('ollama')}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-gray-500" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-directory">Default Processing Directory</Label>
                <Input
                  id="default-directory"
                  value={settings.system?.defaultDirectory || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    system: { ...settings.system, defaultDirectory: e.target.value }
                  })}
                  placeholder="/path/to/card/images"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auto-backup">Auto Backup Interval (hours)</Label>
                <Input
                  id="auto-backup"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.system?.autoBackupInterval || 24}
                  onChange={(e) => setSettings({
                    ...settings,
                    system: { ...settings.system, autoBackupInterval: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-concurrent">Max Concurrent Processing</Label>
                <Input
                  id="max-concurrent"
                  type="number"
                  min="1"
                  max="10"
                  value={settings.system?.maxConcurrentProcessing || 3}
                  onChange={(e) => setSettings({
                    ...settings,
                    system: { ...settings.system, maxConcurrentProcessing: parseInt(e.target.value) }
                  })}
                />
              </div>
              <Button
                onClick={() => handleSave('system', settings.system)}
                disabled={saving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}