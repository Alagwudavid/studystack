#!/bin/bash

# Kill all background processes when script exits
trap "echo 'Stopping all services...'; kill 0" EXIT

# Navigate to script directory (adjust if needed)
cd "$(dirname "$0")"

# Paths
FRONTEND_DIR="C:/Users/hp/Desktop/studystack/"
BACKEND_DIR="C:/Users/hp/Desktop/studystack/backend"
WEBSOCKET_FILE="C:/Users/hp/Desktop/studystack/websocket-server.js"

# Start frontend (pnpm dev)
echo "Starting frontend with pnpm serve..."
cd "$FRONTEND_DIR"
pnpm dev &

# Start backend (Laravel)
echo "Starting Laravel backend..."
cd "$BACKEND_DIR"
php artisan serve --host=0.0.0.0 --port=8000 &

# Start WebSocket server
echo "Starting WebSocket server..."
cd "$FRONTEND_DIR"
node "$WEBSOCKET_FILE" &

# Keep script running until processes are killed
wait
echo "All services have been started. Press Ctrl+C to stop."
