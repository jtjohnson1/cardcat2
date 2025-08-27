const express = require('express');
const router = express.Router();
const settingsService = require('../services/settingsService');

// GET /api/settings - Get system settings
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/settings');

    const settings = await settingsService.getSettings();

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error in GET /api/settings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/settings - Update system settings
router.put('/', async (req, res) => {
  try {
    const { settings } = req.body;
    console.log('PUT /api/settings - Settings:', settings);

    if (!settings) {
      return res.status(400).json({
        success: false,
        error: 'Settings object is required'
      });
    }

    await settingsService.updateSettings(settings);

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error in PUT /api/settings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/settings/test-connection - Test connection to external service
router.post('/test-connection', async (req, res) => {
  try {
    const { service, credentials } = req.body;
    console.log('POST /api/settings/test-connection - Service:', service);

    if (!service || !credentials) {
      return res.status(400).json({
        success: false,
        error: 'Service and credentials are required'
      });
    }

    const result = await settingsService.testConnection(service, credentials);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error in POST /api/settings/test-connection:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;