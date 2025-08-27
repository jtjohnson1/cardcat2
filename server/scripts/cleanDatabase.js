const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Clean all mock/test data from database
async function cleanDatabase() {
  try {
    console.log('Starting database cleanup...');

    // Remove all cards from the cards collection
    const cardResult = await mongoose.connection.db.collection('cards').deleteMany({});
    console.log(`Deleted ${cardResult.deletedCount} cards from database`);

    // Remove any other test collections if they exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Clean up any test/mock data from other collections
    for (const collection of collections) {
      if (collection.name.includes('test') || collection.name.includes('mock')) {
        const result = await mongoose.connection.db.collection(collection.name).deleteMany({});
        console.log(`Deleted ${result.deletedCount} documents from ${collection.name}`);
      }
    }

    console.log('Database cleanup completed successfully');
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await connectDB();
    await cleanDatabase();
    
    // Verify cleanup
    const cardCount = await mongoose.connection.db.collection('cards').countDocuments();
    console.log(`Verification: ${cardCount} cards remaining in database`);
    
    if (cardCount === 0) {
      console.log('✅ Database successfully cleaned - no cards remaining');
    } else {
      console.log('⚠️  Warning: Some cards still exist in database');
    }
    
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the script
main();