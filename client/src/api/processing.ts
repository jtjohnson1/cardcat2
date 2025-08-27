import api from './api';

// Description: Get directory contents
// Endpoint: GET /api/processing/directory
// Request: { path: string }
// Response: { success: boolean, contents: Array<{ name: string, type: 'file' | 'directory', path: string }> }
export const getDirectoryContents = async (path: string = '/') => {
  try {
    const response = await api.get('/api/processing/directory', { params: { path } });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Start processing selected batches
// Endpoint: POST /api/processing/start
// Request: { batches: Array<string>, directory: string }
// Response: { success: boolean, message: string, jobId: string }
export const startProcessing = async (data: { batches: string[], directory: string }) => {
  try {
    const response = await api.post('/api/processing/start', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Pause processing
// Endpoint: POST /api/processing/pause
// Request: { jobId: string }
// Response: { success: boolean, message: string }
export const pauseProcessing = async (data: { jobId: string }) => {
  try {
    const response = await api.post('/api/processing/pause', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Resume processing
// Endpoint: POST /api/processing/resume
// Request: { jobId: string }
// Response: { success: boolean, message: string }
export const resumeProcessing = async (data: { jobId: string }) => {
  try {
    const response = await api.post('/api/processing/resume', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Get processing status
// Endpoint: GET /api/processing/status
// Request: { jobId?: string }
// Response: { success: boolean, status: object }
export const getProcessingStatus = async (jobId?: string) => {
  try {
    const params = jobId ? { jobId } : {};
    const response = await api.get('/api/processing/status', { params });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}