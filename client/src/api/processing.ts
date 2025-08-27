import api from './api';

// Description: Get directory contents for file browser
// Endpoint: GET /api/processing/directory
// Request: { path: string }
// Response: { files: Array<{ name: string, type: 'file' | 'directory', path: string, size?: number }> }
export const getDirectoryContents = (path: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        files: [
          { name: 'batch-001', type: 'directory', path: `${path}/batch-001` },
          { name: 'batch-002', type: 'directory', path: `${path}/batch-002` },
          { name: 'batch-001-001-front.jpg', type: 'file', path: `${path}/batch-001-001-front.jpg`, size: 2048576 },
          { name: 'batch-001-001-back.jpg', type: 'file', path: `${path}/batch-001-001-back.jpg`, size: 1987654 },
          { name: 'batch-001-002-front.jpg', type: 'file', path: `${path}/batch-001-002-front.jpg`, size: 2156789 },
          { name: 'batch-001-002-back.jpg', type: 'file', path: `${path}/batch-001-002-back.jpg`, size: 2034567 },
          { name: 'batch-002-001-front.jpg', type: 'file', path: `${path}/batch-002-001-front.jpg`, size: 1876543 },
          { name: 'batch-002-001-back.jpg', type: 'file', path: `${path}/batch-002-001-back.jpg`, size: 1923456 }
        ]
      });
    }, 300);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/processing/directory', { params: { path } });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Start processing selected batches
// Endpoint: POST /api/processing/start
// Request: { batches: string[], directory: string }
// Response: { success: boolean, message: string, jobId: string }
export const startProcessing = (data: { batches: string[], directory: string }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Processing started successfully',
        jobId: 'job_' + Date.now()
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/processing/start', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Get current processing status
// Endpoint: GET /api/processing/status
// Request: {}
// Response: { isComplete: boolean, processed: number, total: number, currentCard?: any, successful: number, failed: number, speed: number, estimatedTimeRemaining: string, errors: any[] }
export const getProcessingStatus = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isComplete: false,
        processed: 12,
        total: 25,
        currentCard: {
          name: 'batch-001-003-front.jpg',
          thumbnail: null
        },
        successful: 11,
        failed: 1,
        speed: 15,
        estimatedTimeRemaining: '2m 30s',
        errors: [
          {
            message: 'Low image quality detected',
            cardName: 'batch-001-002-back.jpg'
          }
        ]
      });
    }, 200);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/processing/status');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Pause current processing
// Endpoint: POST /api/processing/pause
// Request: {}
// Response: { success: boolean, message: string }
export const pauseProcessing = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Processing paused successfully'
      });
    }, 200);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/processing/pause');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Resume paused processing
// Endpoint: POST /api/processing/resume
// Request: {}
// Response: { success: boolean, message: string }
export const resumeProcessing = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Processing resumed successfully'
      });
    }, 200);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/processing/resume');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}