#!/bin/bash

echo "========================================"
echo "🚀 Starting application"
echo "========================================"

# ============================================================
# BACKEND SETUP
# ============================================================

echo ""
echo "📦 Setting up backend..."

cd "$(dirname "$0")/backend" || {
    echo "❌ Failed to change directory to backend"
    exit 1
}

echo "📍 Backend directory:"
pwd

# ------------------------------------------------------------
# Create virtual environment if it doesn't exist
# ------------------------------------------------------------

if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python -m venv venv

    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi

    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# ------------------------------------------------------------
# Activate virtual environment
# ------------------------------------------------------------

if [ -f "venv/Scripts/activate" ]; then
    echo "🐍 Activating Windows virtual environment..."
    source venv/Scripts/activate

elif [ -f "venv/bin/activate" ]; then
    echo "🐍 Activating Linux/macOS virtual environment..."
    source venv/bin/activate

else
    echo "❌ Could not find virtual environment activation script"
    exit 1
fi

# ------------------------------------------------------------
# Install backend dependencies
# ------------------------------------------------------------

echo ""
echo "📦 Installing backend dependencies..."

python -m pip install --upgrade pip

if python -m pip install \
    fastapi \
    uvicorn \
    supabase \
    python-dotenv \
    pydantic-settings
then
    echo ""
    echo "----------------------------------------"
    echo "✅ Backend packages installed"
    echo "----------------------------------------"
else
    echo ""
    echo "----------------------------------------"
    echo "❌ Backend package installation failed"
    echo "----------------------------------------"
    exit 1
fi

# ------------------------------------------------------------
# Test Supabase connection/import
# ------------------------------------------------------------

echo ""
echo "🔌 Testing Supabase client..."

if python -c "from app.db import supabase; print('Supabase client created')"; then
    echo "✅ Supabase client initialized"
else
    echo "⚠️ Supabase client test failed"
    echo "Continuing anyway..."
fi

# ============================================================
# FRONTEND
# ============================================================

echo ""
echo "========================================"
echo "🌐 Starting frontend"
echo "========================================"

# We are currently in project/backend.
# Go to project/frontend.
cd ../frontend || {
    echo "❌ Failed to change directory to frontend"
    exit 1
}

echo "📍 Frontend directory:"
pwd

echo ""
echo "🚀 Starting Vite..."

# ------------------------------------------------------------
# Start frontend in background
# ------------------------------------------------------------

npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

echo "Frontend process started with PID: $FRONTEND_PID"

# ------------------------------------------------------------
# Wait until Vite is actually running
# ------------------------------------------------------------

echo ""
echo "⏳ Waiting for frontend..."

FRONTEND_READY=false

for i in {1..30}; do

    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        FRONTEND_READY=true
        break
    fi

    echo "   Waiting... ($i/30)"
    sleep 1
done

# ------------------------------------------------------------
# Check frontend result
# ------------------------------------------------------------

if [ "$FRONTEND_READY" = true ]; then

    echo ""
    echo "----------------------------------------"
    echo "✅ FRONTEND IS RUNNING"
    echo "----------------------------------------"
    echo "🌐 http://localhost:5173"
    echo "----------------------------------------"

    # Open browser on Windows/macOS/Linux
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        start http://localhost:5173

    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:5173

    else
        xdg-open http://localhost:5173
    fi

else

    echo ""
    echo "----------------------------------------"
    echo "❌ FRONTEND FAILED TO START"
    echo "----------------------------------------"

    echo ""
    echo "📄 Vite output:"
    echo "----------------------------------------"

    cat frontend.log

    echo "----------------------------------------"

    echo ""
    echo "Stopping script because frontend failed."

    exit 1
fi

# ============================================================
# BACKEND
# ============================================================

echo ""
echo "========================================"
echo "🔵 Starting backend"
echo "========================================"

# We are currently:
# project/
#
# Go into:
# project/backend
cd ../
cd backend || {
    echo "❌ Failed to change directory to backend"
    exit 1
}

echo "📍 Backend directory:"
pwd

echo ""
echo "🚀 Starting FastAPI..."
echo "🌐 Backend: http://127.0.0.1:8000"
echo ""

# ------------------------------------------------------------
# Start Uvicorn
# ------------------------------------------------------------

if uvicorn app.main:app --reload; then

    echo ""
    echo "----------------------------------------"
    echo "✅ Backend stopped normally"
    echo "----------------------------------------"

else

    echo ""
    echo "----------------------------------------"
    echo "❌ Backend failed to start"
    echo "----------------------------------------"

fi

# ============================================================
# CLEANUP
# ============================================================

echo ""
echo "🛑 Stopping frontend..."

if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null
fi

echo "👋 Application stopped."

cd "../" || {
    echo "❌ Failed to change directory to project root"
    exit 1
}
exec bash