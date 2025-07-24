#!/bin/bash

# SrvdNeat Business Plan Protection Server Startup Script

echo "🔒 Starting SrvdNeat Business Plan Protection Server..."

# Check if port 3000 is in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Attempting to free it..."
    PID=$(lsof -ti:3000)
    kill $PID
    sleep 2
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🚀 Starting server on http://localhost:3000"
echo "📄 Access your protected business plan at: http://localhost:3000/protected_business_plan.html"
echo ""
echo "Default credentials:"
echo "  Admin: admin / srvdneat2025"
echo "  Investor: investor / investor2025"
echo "  Partner: partner / partner2025"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Open browser automatically (macOS)
if command -v open &> /dev/null; then
    echo "🌐 Opening browser..."
    sleep 2 && open "http://localhost:3000/protected_business_plan.html" &
fi

npm start 