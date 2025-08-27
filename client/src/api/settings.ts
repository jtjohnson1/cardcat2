import api from './api';

// Description: Get system settings
// Endpoint: GET /api/settings
// Request: {}
// Response: { settings: object }
export const getSettings = async () => {
  try {
    const response = await api.get('/api/settings');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Update system settings
// Endpoint: PUT /api/settings
// Request: { settings: object }
// Response: { success: boolean, message: string }
export const updateSettings = async (settings: any) => {
  try {
    const response = await api.put('/api/settings', { settings });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Test connection to external service
// Endpoint: POST /api/settings/test-connection
// Request: { service: string, credentials: object }
// Response: { success: boolean, message: string }
export const testConnection = async (service: string, credentials: any) => {
  try {
    const response = await api.post('/api/settings/test-connection', { service, credentials });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}