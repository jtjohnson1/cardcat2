import api from './api';

// Description: Get dashboard statistics
// Endpoint: GET /api/dashboard/stats
// Request: {}
// Response: { totalCards: number, recentActivity: Array, processingStats: object, systemStatus: object }
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Get recent activity feed
// Endpoint: GET /api/dashboard/activity
// Request: {}
// Response: { activities: Array<{ id: string, type: string, description: string, timestamp: string }> }
export const getRecentActivity = async () => {
  try {
    const response = await api.get('/api/dashboard/activity');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}