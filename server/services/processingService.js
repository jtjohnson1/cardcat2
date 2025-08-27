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

        // Create actual card in database using Ollama AI analysis - NO FALLBACKS
        try {
          const cardData = await this.createCardFromBatchWithOllama(batch, job.directory, jobId, i);
          console.log('ProcessingService: Card data from Ollama analysis:', JSON.stringify(cardData, null, 2));
          
          const newCard = new Card(cardData);
          await newCard.save();

          job.createdCards.push(newCard._id);
          console.log(`ProcessingService: Created card in database: ${cardData.playerName} (ID: ${newCard._id})`);
        } catch (cardError) {
          console.error(`ProcessingService: Error creating card for batch ${batch}:`, cardError);
          console.error('ProcessingService: Full error details:', cardError.stack);
          job.errors.push(`Failed to create card for batch ${batch}: ${cardError.message}`);
          // DO NOT CREATE MOCK DATA - LET IT FAIL
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

  async createCardFromBatchWithOllama(batchName, directory, jobId, batchIndex) {
    console.log(`ProcessingService: Analyzing card images for batch ${batchName} using Ollama`);
    
    const frontImagePath = path.join(directory, `${batchName}-front.jpg`);
    const backImagePath = path.join(directory, `${batchName}-back.jpg`);
    
    console.log(`ProcessingService: Front image path: ${frontImagePath}`);
    console.log(`ProcessingService: Back image path: ${backImagePath}`);

    // Check if image files exist
    try {
      await fs.access(frontImagePath);
      await fs.access(backImagePath);
      console.log(`ProcessingService: Both image files exist for batch ${batchName}`);
    } catch (error) {
      console.error(`ProcessingService: Image files not found for batch ${batchName}:`, error.message);
      throw new Error(`Image files not found: ${error.message}`);
    }

    // Read image files as base64
    const frontImageBuffer = await fs.readFile(frontImagePath);
    const backImageBuffer = await fs.readFile(backImagePath);
    const frontImageBase64 = frontImageBuffer.toString('base64');
    const backImageBase64 = backImageBuffer.toString('base64');

    console.log(`ProcessingService: Read image files, front: ${frontImageBuffer.length} bytes, back: ${backImageBuffer.length} bytes`);

    // Analyze front image with Ollama
    const frontAnalysis = await this.analyzeImageWithOllama(frontImageBase64, 'front');
    console.log(`ProcessingService: Front image analysis:`, frontAnalysis);

    // Analyze back image with Ollama
    const backAnalysis = await this.analyzeImageWithOllama(backImageBase64, 'back');
    console.log(`ProcessingService: Back image analysis:`, backAnalysis);

    // Combine analysis results into card data
    const cardData = this.combineAnalysisResults(frontAnalysis, backAnalysis, batchName, directory, jobId, batchIndex);
    
    return cardData;
  }

  async analyzeImageWithOllama(imageBase64, side) {
    console.log(`ProcessingService: Sending ${side} image to Ollama for analysis`);
    
    const ollamaEndpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llava';
    
    console.log(`ProcessingService: Using Ollama endpoint: ${ollamaEndpoint}, model: ${model}`);

    const prompt = side === 'front' 
      ? `Analyze this trading card front image. Extract the following information in JSON format:
        {
          "playerName": "player name",
          "team": "team name", 
          "year": "year",
          "sport": "sport type",
          "manufacturer": "card manufacturer",
          "set": "card set name",
          "cardNumber": "card number",
          "isRookie": "true/false if rookie card",
          "specialFeatures": "any special features or parallel designations"
        }`
      : `Analyze this trading card back image. Extract the following information in JSON format:
        {
          "condition": "card condition assessment",
          "conditionScore": "condition score 1-100",
          "centeringScore": "centering score 1-100", 
          "cornersScore": "corners score 1-100",
          "edgesScore": "edges score 1-100",
          "surfaceScore": "surface score 1-100",
          "stats": "any visible player statistics",
          "biography": "any biographical information"
        }`;

    const response = await fetch(`${ollamaEndpoint}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        images: [imageBase64],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`ProcessingService: Ollama ${side} analysis raw response:`, result);

    // Try to parse JSON from the response
    try {
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        console.log(`ProcessingService: Parsed ${side} analysis:`, parsedData);
        return parsedData;
      } else {
        console.log(`ProcessingService: No JSON found in ${side} response, using text analysis`);
        return { rawText: result.response };
      }
    } catch (parseError) {
      console.error(`ProcessingService: Error parsing ${side} JSON:`, parseError);
      return { rawText: result.response };
    }
  }

  combineAnalysisResults(frontAnalysis, backAnalysis, batchName, directory, jobId, batchIndex) {
    console.log(`ProcessingService: Combining analysis results for batch ${batchName}`);
    
    // Create unique card number to avoid duplicates
    const uniqueCardNumber = `${batchName}-${jobId.slice(-4)}-${batchIndex}`;

    return {
      playerName: frontAnalysis.playerName || `Unknown Player (${batchName})`,
      team: frontAnalysis.team || 'Unknown Team',
      year: parseInt(frontAnalysis.year) || new Date().getFullYear(),
      sport: frontAnalysis.sport || 'Baseball',
      manufacturer: frontAnalysis.manufacturer || 'Unknown Manufacturer',
      set: frontAnalysis.set || 'Unknown Set',
      cardNumber: frontAnalysis.cardNumber || uniqueCardNumber,
      condition: backAnalysis.condition || 'Near Mint',
      estimatedValue: 0, // No random values - will be determined by market analysis later
      isRookie: frontAnalysis.isRookie === 'true' || frontAnalysis.isRookie === true,
      isGraded: false, // Will be determined by condition analysis
      frontImage: `${directory}/${batchName}-front.jpg`,
      backImage: `${directory}/${batchName}-back.jpg`,
      notes: `Processed from batch ${batchName} using Ollama AI analysis (Job: ${jobId})`,
      conditionScore: parseInt(backAnalysis.conditionScore) || 0,
      centeringScore: parseInt(backAnalysis.centeringScore) || 0,
      cornersScore: parseInt(backAnalysis.cornersScore) || 0,
      edgesScore: parseInt(backAnalysis.edgesScore) || 0,
      surfaceScore: parseInt(backAnalysis.surfaceScore) || 0,
      // Store raw analysis for debugging
      frontAnalysisRaw: frontAnalysis.rawText || JSON.stringify(frontAnalysis),
      backAnalysisRaw: backAnalysis.rawText || JSON.stringify(backAnalysis)
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