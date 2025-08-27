import api from './api';

// Description: Get dashboard statistics
// Endpoint: GET /api/dashboard/stats
// Request: {}
// Response: { totalCards: number, cardsProcessedToday: number, queueSize: number, systemStatus: string, cardsTrend: number, processingTrend: number, processingSpeed: number, successRate: number, avgProcessingTime: number }
export const getDashboardStats = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalCards: 1247,
        cardsProcessedToday: 23,
        queueSize: 5,
        systemStatus: "Online",
        cardsTrend: 12,
        processingTrend: 8,
        processingSpeed: 15,
        successRate: 94,
        avgProcessingTime: 4.2
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/dashboard/stats');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Get recent activity feed
// Endpoint: GET /api/dashboard/activity
// Request: {}
// Response: { activities: Array<{ _id: string, type: string, message: string, timestamp: string, details?: string }> }
export const getRecentActivity = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        activities: [
          {
            _id: '1',
            type: 'success',
            message: 'Processed batch-001 successfully',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            details: '15 cards processed'
          },
          {
            _id: '2',
            type: 'processing',
            message: 'Started processing batch-002',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            details: '8 cards in queue'
          },
          {
            _id: '3',
            type: 'error',
            message: 'Failed to process card-045-front.jpg',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            details: 'Image quality too low'
          },
          {
            _id: '4',
            type: 'success',
            message: 'Price update completed',
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            details: '1247 cards updated'
          }
        ]
      });
    }, 300);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/dashboard/activity');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}