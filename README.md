# CardCat Trading Card Management System

A comprehensive trading card inventory management system that automates the process of cataloging, analyzing, and pricing trading cards using AI-powered image recognition and real-time market data integration.

## Prerequisites

Before running CardCat, make sure you have the following installed:

1. **Node.js** (version 16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)

2. **MongoDB** (version 4.4 or higher)
   - **macOS**: `brew install mongodb/brew/mongodb-community`
   - **Ubuntu/Debian**: Follow [MongoDB Ubuntu installation guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

3. **Git** (to clone the repository)
   - Download from [git-scm.com](https://git-scm.com/)

## Quick Start

### Option 1: Using the Startup Script (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd CardCat
   ```

2. **Make the startup script executable:**
   ```bash
   chmod +x startup.sh
   ```

3. **Run the startup script:**
   ```bash
   ./startup.sh
   ```

The script will automatically:
- Check if MongoDB is running and start it if needed
- Create the necessary `.env` file
- Install all dependencies
- Start both frontend and backend servers

### Option 2: Manual Setup

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd CardCat
   ```

2. **Start MongoDB:**
   ```bash
   # macOS with Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # Linux with systemctl
   sudo systemctl start mongod
   
   # Linux with service
   sudo service mongod start
   
   # Windows
   net start MongoDB
   ```

3. **Create environment file:**
   ```bash
   # Create server/.env file
   cat > server/.env << EOF
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/cardcat
   SESSION_SECRET=your-secret-key-here-change-this-in-production
   EOF
   ```

4. **Install dependencies:**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install && cd ..
   
   # Install server dependencies
   cd server && npm install && cd ..
   ```

5. **Start the application:**
   ```bash
   npm run start
   ```

## Accessing the Application

Once started, you can access:

- **Frontend (React App)**: http://localhost:5173
- **Backend API**: http://localhost:3000

## Available Scripts

- `npm run start` - Start both frontend and backend concurrently
- `npm run client` - Start only the frontend development server
- `npm run server` - Start only the backend server
- `npm run build` - Build the frontend for production

## Project Structure

```
CardCat/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API integration
│   │   └── ...
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── config/             # Configuration files
│   └── package.json
├── startup.sh              # Automated startup script
└── package.json            # Root package.json
```

## Features

- **Dashboard**: Overview of your card collection with statistics
- **File Processing**: AI-powered card image recognition and cataloging
- **Card Database**: Comprehensive card management with search and filters
- **Card Details**: Detailed view with pricing analysis and market data
- **Settings**: Configuration for external integrations

## Troubleshooting

### MongoDB Connection Issues

If you see MongoDB connection errors:

1. **Check if MongoDB is running:**
   ```bash
   # Check if MongoDB process is running
   pgrep mongod
   
   # Or check MongoDB status
   brew services list | grep mongodb  # macOS
   sudo systemctl status mongod       # Linux
   ```

2. **Start MongoDB if not running:**
   ```bash
   # macOS
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Check MongoDB logs:**
   ```bash
   # macOS (Homebrew)
   tail -f /usr/local/var/log/mongodb/mongo.log
   
   # Linux
   sudo tail -f /var/log/mongodb/mongod.log
   ```

### Port Already in Use

If you get "port already in use" errors:

```bash
# Kill processes on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill processes on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Dependencies Issues

If you encounter dependency issues:

```bash
# Clean install all dependencies
rm -rf node_modules client/node_modules server/node_modules
rm package-lock.json client/package-lock.json server/package-lock.json
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

## Development

For development, you can run the frontend and backend separately:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## Support

If you encounter any issues:

1. Check that all prerequisites are installed
2. Ensure MongoDB is running
3. Verify all dependencies are installed
4. Check the console logs for specific error messages

For additional help, please check the troubleshooting section above or create an issue in the project repository.