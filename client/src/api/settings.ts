import api from './api';

// Description: Get all system settings
// Endpoint: GET /api/settings
// Request: {}
// Response: Settings object with all configurations
export const getSettings = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ebay: {
          appId: '****',
          certId: '****',
          devId: '****'
        },
        tcgplayer: {
          publicKey: '****',
          privateKey: '****',
          partnerKey: '****'
        },
        mongodb: {
          uri: 'mongodb://localhost:27017/cardcat',
          database: 'cardcat'
        },
        ollama: {
          endpoint: 'http://localhost:11434',
          model: 'llava',
          confidenceThreshold: 85
        },
        system: {
          defaultDirectory: '/home/user/cards',
          autoBackupInterval: 24,
          maxConcurrentProcessing: 3
        },
        connectionStatus: {
          ebay: 'connected',
          tcgplayer: 'disconnected',
          mongodb: 'connected',
          ollama: 'connected'
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/settings');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Update settings for a specific section
// Endpoint: PUT /api/settings
// Request: { section: string, data: any }
// Response: { success: boolean, message: string }
export const updateSettings = (data: { section: string, data: any }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Settings updated successfully'
      });
    }, 400);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put('/api/settings', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Test connection to external service
// Endpoint: POST /api/settings/test-connection
// Request: { service: string }
// Response: { status: string, message: string }
export const testConnection = (service: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const isConnected = Math.random() > 0.3; // 70% success rate for demo
      resolve({
        status: isConnected ? 'connected' : 'failed',
        message: isConnected 
          ? `Successfully connected to ${service}` 
          : `Failed to connect to ${service}. Please check your credentials.`
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/settings/test-connection', { service });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}