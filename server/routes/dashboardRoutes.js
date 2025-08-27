const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboardService');

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('GET /api/dashboard/stats');

    const stats = await dashboardService.getDashboardStats();

    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    console.error('Error in GET /api/dashboard/stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/dashboard/activity - Get recent activity feed
router.get('/activity', async (req, res) => {
  try {
    console.log('GET /api/dashboard/activity');

    const activities = await dashboardService.getRecentActivity();

    res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Error in GET /api/dashboard/activity:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;