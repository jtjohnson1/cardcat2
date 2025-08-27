#!/bin/bash

echo "🚀 Starting CardCat Trading Card Management System..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running. Starting MongoDB..."

    # Try to start MongoDB (different methods for different systems)
    if command -v brew &> /dev/null && brew services list | grep -q mongodb; then
        echo "📦 Starting MongoDB via Homebrew..."
        brew services start mongodb/brew/mongodb-community
    elif command -v systemctl &> /dev/null; then
        echo "🐧 Starting MongoDB via systemctl..."
        sudo systemctl start mongod
    elif command -v service &> /dev/null; then
        echo "🐧 Starting MongoDB via service..."
        sudo service mongod start
    else
        echo "⚠️  Please start MongoDB manually before running this script"
        echo "   - On macOS with Homebrew: brew services start mongodb/brew/mongodb-community"
        echo "   - On Linux: sudo systemctl start mongod"
        echo "   - On Windows: net start MongoDB"
        exit 1
    fi

    # Wait for MongoDB to start
    echo "⏳ Waiting for MongoDB to start..."
    sleep 3
fi

# Check if .env file exists in server directory
if [ ! -f "server/.env" ]; then
    echo "📝 Creating server/.env file..."
    cat > server/.env << EOF
PORT=3000
DATABASE_URL=mongodb://localhost:27017/cardcat
SESSION_SECRET=your-secret-key-here-change-this-in-production
EOF
    echo "✅ Created server/.env file with default values"
else
    echo "✅ server/.env file already exists"
fi

# Always install/update dependencies to ensure all packages are present
echo "📦 Installing/updating root dependencies..."
npm install

echo "📦 Installing/updating client dependencies..."
cd client && npm install && cd ..

echo "📦 Installing/updating server dependencies..."
cd server && npm install && cd ..

# Verify critical dependencies are installed
echo "🔍 Verifying server dependencies..."
if [ ! -d "server/node_modules/uuid" ]; then
    echo "❌ uuid package missing, installing..."
    cd server && npm install uuid && cd ..
fi

if [ ! -d "server/node_modules/express" ]; then
    echo "❌ express package missing, installing..."
    cd server && npm install express && cd ..
fi

if [ ! -d "server/node_modules/mongoose" ]; then
    echo "❌ mongoose package missing, installing..."
    cd server && npm install mongoose && cd ..
fi

echo "🎯 Starting CardCat application..."
echo "📱 Frontend will be available at: http://localhost:5173"
echo "🔧 Backend API will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start the application
npm run start