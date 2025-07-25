#!/bin/bash

echo "🚀 Setting up TutorShare..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14+ and try again."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create backend .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cat > backend/.env << EOL
PORT=5000
JWT_SECRET=your-very-secure-jwt-secret-key-here-$(date +%s)
NODE_ENV=development
EOL
    echo "✅ Created backend/.env file"
else
    echo "✅ Backend .env file already exists"
fi

# Create uploads directory if it doesn't exist
if [ ! -d backend/uploads ]; then
    mkdir -p backend/uploads
    echo "✅ Created uploads directory"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
echo "To start individual services:"
echo "  Backend only: npm run server"
echo "  Frontend only: npm run client"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:5000"
echo "" 