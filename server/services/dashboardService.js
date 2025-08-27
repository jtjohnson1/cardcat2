const Card = require('../models/Card');

class DashboardService {
  async getDashboardStats() {
    try {
      console.log('DashboardService: Getting dashboard statistics');

      // Get total cards count
      const totalCards = await Card.countDocuments();

      // Get cards added in last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const cardsAddedToday = await Card.countDocuments({
        createdAt: { $gte: yesterday }
      });

      // Get cards added in last 7 days
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const cardsAddedThisWeek = await Card.countDocuments({
        createdAt: { $gte: lastWeek }
      });

      // Get cards added in last 30 days
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);
      const cardsAddedThisMonth = await Card.countDocuments({
        createdAt: { $gte: lastMonth }
      });

      // Get total estimated value
      const valueAggregation = await Card.aggregate([
        {
          $group: {
            _id: null,
            totalValue: { $sum: '$estimatedValue' },
            avgValue: { $avg: '$estimatedValue' }
          }
        }
      ]);

      const totalValue = valueAggregation.length > 0 ? valueAggregation[0].totalValue : 0;
      const avgValue = valueAggregation.length > 0 ? valueAggregation[0].avgValue : 0;

      console.log(`DashboardService: Found ${totalCards} total cards`);

      return {
        totalCards,
        cardsAddedToday,
        cardsAddedThisWeek,
        cardsAddedThisMonth,
        totalValue: totalValue || 0,
        avgValue: avgValue || 0,
        processingStats: {
          queueSize: 0,
          processing: false,
          lastProcessed: null
        },
        systemStatus: {
          status: 'healthy',
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage()
        }
      };
    } catch (error) {
      console.error('DashboardService: Error getting dashboard stats:', error);
      throw error;
    }
  }

  async getRecentActivity() {
    try {
      console.log('DashboardService: Getting recent activity');

      // Get recent cards (last 10)
      const recentCards = await Card.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('playerName team year manufacturer createdAt');

      // Convert to activity format
      const activities = recentCards.map(card => ({
        id: card._id.toString(),
        type: 'card_added',
        description: `Added ${card.playerName} - ${card.year} ${card.manufacturer}`,
        timestamp: card.createdAt.toISOString(),
        details: {
          playerName: card.playerName,
          team: card.team,
          year: card.year,
          manufacturer: card.manufacturer
        }
      }));

      console.log(`DashboardService: Found ${activities.length} recent activities`);
      return activities;
    } catch (error) {
      console.error('DashboardService: Error getting recent activity:', error);
      throw error;
    }
  }
}

module.exports = new DashboardService();