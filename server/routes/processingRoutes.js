const express = require('express');
const router = express.Router();
const processingService = require('../services/processingService');

// GET /api/processing/directory - Get directory contents
router.get('/directory', async (req, res) => {
  try {
    const { path = '/' } = req.query;
    console.log('GET /api/processing/directory - Path:', path);

    const contents = await processingService.getDirectoryContents(path);

    res.json({
      success: true,
      contents
    });
  } catch (error) {
    console.error('Error in GET /api/processing/directory:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/processing/start - Start processing batches
router.post('/start', async (req, res) => {
  try {
    const { batches, directory } = req.body;
    console.log('POST /api/processing/start - Batches:', batches, 'Directory:', directory);

    if (!batches || !Array.isArray(batches) || batches.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Batches array is required'
      });
    }

    const result = await processingService.startProcessing(batches, directory);

    res.json({
      success: true,
      message: 'Processing started successfully',
      jobId: result.jobId
    });
  } catch (error) {
    console.error('Error in POST /api/processing/start:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/processing/pause - Pause processing
router.post('/pause', async (req, res) => {
  try {
    const { jobId } = req.body;
    console.log('POST /api/processing/pause - Job ID:', jobId);

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required'
      });
    }

    await processingService.pauseProcessing(jobId);

    res.json({
      success: true,
      message: 'Processing paused successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/processing/pause:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/processing/resume - Resume processing
router.post('/resume', async (req, res) => {
  try {
    const { jobId } = req.body;
    console.log('POST /api/processing/resume - Job ID:', jobId);

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required'
      });
    }

    await processingService.resumeProcessing(jobId);

    res.json({
      success: true,
      message: 'Processing resumed successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/processing/resume:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/processing/status - Get processing status
router.get('/status', async (req, res) => {
  try {
    const { jobId } = req.query;
    console.log('GET /api/processing/status - Job ID:', jobId);

    const status = await processingService.getProcessingStatus(jobId);

    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Error in GET /api/processing/status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;