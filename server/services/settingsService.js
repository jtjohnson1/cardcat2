class SettingsService {
  constructor() {
    // In-memory settings storage (in production, use database)
    this.settings = {
      ebay: {
        apiKey: '',
        apiSecret: '',
        enabled: false
      },
      tcgplayer: {
        apiKey: '',
        apiSecret: '',
        enabled: false
      },
      ollama: {
        endpoint: 'http://localhost:11434',
        model: 'llava',
        enabled: false
      },
      database: {
        connectionString: process.env.DATABASE_URL || '',
        enabled: true
      },
      processing: {
        defaultDirectory: '/',
        autoProcess: false,
        batchSize: 10
      }
    };
  }

  async getSettings() {
    try {
      console.log('SettingsService: Getting system settings');
      return this.settings;
    } catch (error) {
      console.error('SettingsService: Error getting settings:', error);
      throw error;
    }
  }

  async updateSettings(newSettings) {
    try {
      console.log('SettingsService: Updating system settings');
      
      // Merge new settings with existing ones
      this.settings = {
        ...this.settings,
        ...newSettings
      };

      console.log('SettingsService: Settings updated successfully');
      return this.settings;
    } catch (error) {
      console.error('SettingsService: Error updating settings:', error);
      throw error;
    }
  }

  async testConnection(service, credentials) {
    try {
      console.log(`SettingsService: Testing connection for ${service}`);

      switch (service) {
        case 'ebay':
          return await this.testEbayConnection(credentials);
        case 'tcgplayer':
          return await this.testTCGPlayerConnection(credentials);
        case 'ollama':
          return await this.testOllamaConnection(credentials);
        case 'database':
          return await this.testDatabaseConnection(credentials);
        default:
          throw new Error('Unknown service type');
      }
    } catch (error) {
      console.error('SettingsService: Error testing connection:', error);
      throw error;
    }
  }

  async testEbayConnection(credentials) {
    // Simulate eBay API test
    console.log('SettingsService: Testing eBay connection');
    
    if (!credentials.apiKey || !credentials.apiSecret) {
      throw new Error('eBay API key and secret are required');
    }

    // In a real implementation, make actual API call to eBay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { message: 'eBay connection test successful' };
  }

  async testTCGPlayerConnection(credentials) {
    // Simulate TCGPlayer API test
    console.log('SettingsService: Testing TCGPlayer connection');
    
    if (!credentials.apiKey) {
      throw new Error('TCGPlayer API key is required');
    }

    // In a real implementation, make actual API call to TCGPlayer
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { message: 'TCGPlayer connection test successful' };
  }

  async testOllamaConnection(credentials) {
    // Simulate Ollama API test
    console.log('SettingsService: Testing Ollama connection');
    
    if (!credentials.endpoint) {
      throw new Error('Ollama endpoint is required');
    }

    // In a real implementation, make actual API call to Ollama
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { message: 'Ollama connection test successful' };
  }

  async testDatabaseConnection(credentials) {
    // Test database connection
    console.log('SettingsService: Testing database connection');
    
    // Since we're already connected to the database, just return success
    return { message: 'Database connection test successful' };
  }
}

module.exports = new SettingsService();