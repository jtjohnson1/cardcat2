import api from './api';

// Description: Get dashboard statistics
// Endpoint: GET /api/dashboard/stats
// Request: {}
// Response: { totalCards: number, recentActivity: Array, processingStats: object, systemStatus: object }
export const getDashboardStats = async () => {
  try {
    console.log('API: Making request to /api/dashboard/stats')
    const response = await api.get('/api/dashboard/stats');
    console.log('API: Raw response from /api/dashboard/stats:', response)
    console.log('API: Response data:', response.data)
    console.log('API: Response status:', response.status)
    console.log('API: Response headers:', response.headers)
    return response.data;
  } catch (error) {
    console.error('API: Error in getDashboardStats:', error)
    console.error('API: Error response:', error.response)
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Get recent activity feed
// Endpoint: GET /api/dashboard/activity
// Request: {}
// Response: { activities: Array<{ id: string, type: string, description: string, timestamp: string }> }
export const getRecentActivity = async () => {
  try {
    console.log('API: Making request to /api/dashboard/activity')
    const response = await api.get('/api/dashboard/activity');
    console.log('API: Raw response from /api/dashboard/activity:', response)
    console.log('API: Response data:', response.data)
    console.log('API: Response status:', response.status)
    return response.data;
  } catch (error) {
    console.error('API: Error in getRecentActivity:', error)
    console.error('API: Error response:', error.response)
    throw new Error(error?.response?.data?.error || error.message);
  }
}