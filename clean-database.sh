#!/bin/bash

echo "🧹 CardCat Database Cleanup Script"
echo "=================================="

# Check if mongosh is available
if ! command -v mongosh &> /dev/null; then
    echo "❌ Error: mongosh is not installed or not in PATH"
    echo "Please install MongoDB Shell (mongosh) first"
    exit 1
fi

# Get database URL from environment or use default
if [ -f "server/.env" ]; then
    echo "📄 Loading database URL from server/.env file..."
    DATABASE_URL=$(grep "DATABASE_URL" server/.env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
fi

# Fallback to default if not found
if [ -z "$DATABASE_URL" ]; then
    DATABASE_URL="mongodb://localhost:27017/cardcat"
    echo "⚠️  Using default database URL: $DATABASE_URL"
else
    echo "✅ Using database URL from .env: $DATABASE_URL"
fi

echo ""
echo "🗑️  Cleaning all mock and test data from database..."
echo ""

# Execute MongoDB cleanup commands
mongosh "$DATABASE_URL" --eval "
console.log('Connected to database');

// Count existing cards before cleanup
const beforeCount = db.cards.countDocuments();
console.log('Cards before cleanup:', beforeCount);

// Delete all cards
const cardResult = db.cards.deleteMany({});
console.log('Deleted', cardResult.deletedCount, 'cards');

// Delete any test collections
const collections = db.listCollectionNames();
console.log('Available collections:', collections);

collections.forEach(function(collName) {
    if (collName.includes('test') || collName.includes('mock')) {
        const result = db[collName].deleteMany({});
        console.log('Deleted', result.deletedCount, 'documents from', collName);
    }
});

// Verify cleanup
const afterCount = db.cards.countDocuments();
console.log('Cards after cleanup:', afterCount);

if (afterCount === 0) {
    console.log('✅ Database successfully cleaned - no cards remaining');
} else {
    console.log('⚠️  Warning:', afterCount, 'cards still exist in database');
}
"

echo ""
echo "🎉 Database cleanup completed!"
echo ""
echo "To verify the cleanup worked, you can run:"
echo "mongosh $DATABASE_URL --eval 'db.cards.countDocuments()'