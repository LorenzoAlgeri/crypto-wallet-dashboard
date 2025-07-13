#!/bin/bash

echo "🚀 Starting Crypto Wallet Dashboard..."
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the wallet-dashboard directory"
    exit 1
fi

# Kill any existing processes on these ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start backend server with absolute path
echo "🖥️  Starting backend server..."
node "$(pwd)/server.js" &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend..."
npm exec vite -- --port 3000 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 2

echo ""
echo "✅ Dashboard started successfully!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo "🔑 Moralis API: Configured"
echo ""
echo "📊 Demo wallet loaded: 0x6339...3F31"
echo "💡 Add your own wallets using the form"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    echo "✅ Services stopped"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
