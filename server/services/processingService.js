const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const Card = require('../models/Card');

// In-memory storage for processing jobs (in production, use Redis or database)
const processingJobs = new Map();

class ProcessingService {
  async getDirectoryContents(dirPath) {
    try {
      console.log('ProcessingService: Getting directory contents for:', dirPath);

      // Handle root path - allow actual filesystem root browsing
      let normalizedPath;
      if (dirPath === '/' || !dirPath) {
        // Use actual filesystem root, not home directory
        normalizedPath = '/';
      } else {
        // Handle absolute paths directly
        if (path.isAbsolute(dirPath)) {
          normalizedPath = path.resolve(dirPath);
        } else {
          // For relative paths, resolve from current working directory
          normalizedPath = path.resolve(dirPath);
        }
      }

      console.log('ProcessingService: Normalized path:', normalizedPath);

      // Security check - ensure the path exists and is accessible
      let stats;
      try {
        stats = await fs.stat(normalizedPath);
      } catch (error) {
        console.error('ProcessingService: Path not accessible:', normalizedPath, error.message);
        // If path is not accessible, try fallback to root or home
        if (normalizedPath !== '/') {
          normalizedPath = '/';
          try {
            stats = await fs.stat(normalizedPath);
          } catch (rootError) {
            // If root is not accessible, fallback to home directory
            normalizedPath = os.homedir();
            stats = await fs.stat(normalizedPath);
          }
        } else {
          // If root is not accessible, fallback to home directory
          normalizedPath = os.homedir();
          stats = await fs.stat(normalizedPath);
        }
      }

      if (!stats.isDirectory()) {
        throw new Error('Path is not a directory');
      }

      const entries = await fs.readdir(normalizedPath, { withFileTypes: true });

      const contents = entries
        .filter(entry => {
          // Show all files and directories, including hidden ones
          // Don't filter out any files based on name
          return true;
        })
        .map(entry => {
          const fullPath = path.join(normalizedPath, entry.name);

          return {
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            path: fullPath,
            fullPath: fullPath,
            isImage: entry.isFile() && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(entry.name),
            isHidden: entry.name.startsWith('.')
          };
        });

      // Sort: directories first, then files, with hidden items at the end within each category
      contents.sort((a, b) => {
        // First sort by type (directories first)
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        
        // Then sort by hidden status (non-hidden first)
        if (a.isHidden !== b.isHidden) {
          return a.isHidden ? 1 : -1;
        }
        
        // Finally sort alphabetically
        return a.name.localeCompare(b.name);
      });

      console.log(`ProcessingService: Found ${contents.length} items in directory ${normalizedPath}`);
      console.log(`ProcessingService: Items breakdown - Directories: ${contents.filter(c => c.type === 'directory').length}, Files: ${contents.filter(c => c.type === 'file').length}, Hidden: ${contents.filter(c => c.isHidden).length}`);
      
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
        estimatedTimeRemaining: null,
        createdCards: []
      };

      processingJobs.set(jobId, job);

      // Start processing in background
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

        console.log(`ProcessingService: Processing batch ${batch} (${i + 1}/${job.totalItems})`);

        // Create actual card in database instead of just simulating
        try {
          const cardData = await this.createCardFromBatch(batch, job.directory);
          const newCard = new Card(cardData);
          await newCard.save();
          
          job.createdCards.push(newCard._id);
          console.log(`ProcessingService: Created card in database: ${cardData.playerName} (ID: ${newCard._id})`);
        } catch (cardError) {
          console.error(`ProcessingService: Error creating card for batch ${batch}:`, cardError);
          job.errors.push(`Failed to create card for batch ${batch}: ${cardError.message}`);
        }

        // Simulate processing time (reduced for faster testing)
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        console.log(`ProcessingService: Completed batch ${batch} (${i + 1}/${job.totalItems})`);
      }

      job.status = 'completed';
      job.progress = 100;
      job.processedItems = job.totalItems;
      job.currentItem = null;
      job.endTime = new Date();

      console.log(`ProcessingService: Processing completed for job: ${jobId}. Created ${job.createdCards.length} cards.`);
    } catch (error) {
      console.error('ProcessingService: Error during processing:', error);
      job.status = 'error';
      job.errors.push(error.message);
    }
  }

  async createCardFromBatch(batchName, directory) {
    // Generate mock card data based on batch name
    const batchNumber = batchName.match(/\d+/)?.[0] || '001';
    const lotName = batchName.split('-')[0] || 'lot1';
    
    // Sample player names and teams for variety
    const players = [
      'Mike Trout', 'Mookie Betts', 'Aaron Judge', 'Ronald Acuña Jr.', 'Juan Soto',
      'Fernando Tatis Jr.', 'Manny Machado', 'Bryce Harper', 'Freddie Freeman', 'Vladimir Guerrero Jr.'
    ];
    
    const teams = [
      'Los Angeles Angels', 'Los Angeles Dodgers', 'New York Yankees', 'Atlanta Braves', 'San Diego Padres',
      'Philadelphia Phillies', 'Toronto Blue Jays', 'Houston Astros', 'Tampa Bay Rays', 'Boston Red Sox'
    ];
    
    const manufacturers = ['Topps', 'Panini', 'Upper Deck', 'Bowman', 'Donruss'];
    const sets = ['Series 1', 'Series 2', 'Chrome', 'Heritage', 'Stadium Club', 'Finest'];
    const conditions = ['Mint', 'Near Mint', 'Excellent', 'Very Good'];
    
    const playerIndex = parseInt(batchNumber) % players.length;
    const teamIndex = parseInt(batchNumber) % teams.length;
    const manufacturerIndex = parseInt(batchNumber) % manufacturers.length;
    const setIndex = parseInt(batchNumber) % sets.length;
    
    const year = 2020 + (parseInt(batchNumber) % 5); // Years 2020-2024
    
    return {
      playerName: players[playerIndex],
      team: teams[teamIndex],
      year: year,
      sport: 'Baseball',
      manufacturer: manufacturers[manufacturerIndex],
      set: `${year} ${manufacturers[manufacturerIndex]} ${sets[setIndex]}`,
      cardNumber: batchNumber,
      condition: conditions[parseInt(batchNumber) % conditions.length],
      estimatedValue: Math.floor(Math.random() * 500) + 10, // $10-$510
      isRookie: Math.random() > 0.8, // 20% chance of rookie
      isGraded: Math.random() > 0.7, // 30% chance of graded
      frontImage: `${directory}/${batchName}-front.jpg`,
      backImage: `${directory}/${batchName}-back.jpg`,
      notes: `Processed from batch ${batchName} in directory ${directory}`,
      conditionScore: Math.floor(Math.random() * 30) + 70, // 70-100
      centeringScore: Math.floor(Math.random() * 30) + 70,
      cornersScore: Math.floor(Math.random() * 30) + 70,
      edgesScore: Math.floor(Math.random() * 30) + 70,
      surfaceScore: Math.floor(Math.random() * 30) + 70
    };
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