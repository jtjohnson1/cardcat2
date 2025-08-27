const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for processing jobs (in production, use Redis or database)
const processingJobs = new Map();

class ProcessingService {
  async getDirectoryContents(dirPath) {
    try {
      console.log('ProcessingService: Getting directory contents for:', dirPath);

      // Normalize the path
      const normalizedPath = path.resolve(dirPath === '/' ? process.cwd() : dirPath);
      
      // Security check - ensure we're not going outside allowed directories
      const allowedBasePath = process.cwd();
      if (!normalizedPath.startsWith(allowedBasePath)) {
        throw new Error('Access denied: Path outside allowed directory');
      }

      const stats = await fs.stat(normalizedPath);
      if (!stats.isDirectory()) {
        throw new Error('Path is not a directory');
      }

      const entries = await fs.readdir(normalizedPath, { withFileTypes: true });
      
      const contents = entries.map(entry => {
        const fullPath = path.join(normalizedPath, entry.name);
        const relativePath = path.relative(process.cwd(), fullPath);
        
        return {
          name: entry.name,
          type: entry.isDirectory() ? 'directory' : 'file',
          path: relativePath || '.',
          fullPath: fullPath,
          isImage: entry.isFile() && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(entry.name)
        };
      });

      // Sort: directories first, then files
      contents.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      console.log(`ProcessingService: Found ${contents.length} items in directory`);
      return contents;
    } catch (error) {
      console.error('ProcessingService: Error getting directory contents:', error);
      throw error;
    }
  }

  async startProcessing(batches, directory) {
    try {
      console.log('ProcessingService: Starting processing for batches:', batches);

      const jobId = uuidv4();
      
      // Create processing job
      const job = {
        id: jobId,
        batches,
        directory,
        status: 'running',
        progress: 0,
        totalItems: batches.length,
        processedItems: 0,
        currentItem: null,
        errors: [],
        startTime: new Date(),
        estimatedTimeRemaining: null
      };

      processingJobs.set(jobId, job);

      // Start processing in background (simulate processing)
      this.processInBackground(jobId);

      console.log('ProcessingService: Processing job started with ID:', jobId);
      return { jobId };
    } catch (error) {
      console.error('ProcessingService: Error starting processing:', error);
      throw error;
    }
  }

  async processInBackground(jobId) {
    const job = processingJobs.get(jobId);
    if (!job) return;

    try {
      for (let i = 0; i < job.batches.length; i++) {
        if (job.status === 'paused') {
          console.log('ProcessingService: Processing paused for job:', jobId);
          return;
        }

        if (job.status === 'cancelled') {
          console.log('ProcessingService: Processing cancelled for job:', jobId);
          return;
        }

        const batch = job.batches[i];
        job.currentItem = batch;
        job.processedItems = i;
        job.progress = Math.round((i / job.totalItems) * 100);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

        console.log(`ProcessingService: Processed batch ${batch} (${i + 1}/${job.totalItems})`);
      }

      job.status = 'completed';
      job.progress = 100;
      job.processedItems = job.totalItems;
      job.currentItem = null;
      job.endTime = new Date();

      console.log('ProcessingService: Processing completed for job:', jobId);
    } catch (error) {
      console.error('ProcessingService: Error during processing:', error);
      job.status = 'error';
      job.errors.push(error.message);
    }
  }

  async pauseProcessing(jobId) {
    try {
      console.log('ProcessingService: Pausing processing for job:', jobId);

      const job = processingJobs.get(jobId);
      if (!job) {
        throw new Error('Processing job not found');
      }

      job.status = 'paused';
      console.log('ProcessingService: Processing paused successfully');
    } catch (error) {
      console.error('ProcessingService: Error pausing processing:', error);
      throw error;
    }
  }

  async resumeProcessing(jobId) {
    try {
      console.log('ProcessingService: Resuming processing for job:', jobId);

      const job = processingJobs.get(jobId);
      if (!job) {
        throw new Error('Processing job not found');
      }

      if (job.status === 'paused') {
        job.status = 'running';
        // Resume processing in background
        this.processInBackground(jobId);
      }

      console.log('ProcessingService: Processing resumed successfully');
    } catch (error) {
      console.error('ProcessingService: Error resuming processing:', error);
      throw error;
    }
  }

  async getProcessingStatus(jobId) {
    try {
      if (jobId) {
        console.log('ProcessingService: Getting status for job:', jobId);
        const job = processingJobs.get(jobId);
        if (!job) {
          throw new Error('Processing job not found');
        }
        return job;
      } else {
        // Return overall processing status
        console.log('ProcessingService: Getting overall processing status');
        const jobs = Array.from(processingJobs.values());
        const activeJobs = jobs.filter(job => job.status === 'running' || job.status === 'paused');
        
        return {
          activeJobs: activeJobs.length,
          totalJobs: jobs.length,
          jobs: jobs.slice(-10) // Return last 10 jobs
        };
      }
    } catch (error) {
      console.error('ProcessingService: Error getting processing status:', error);
      throw error;
    }
  }
}

module.exports = new ProcessingService();