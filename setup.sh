#!/bin/bash

# Crypto Wallet Dashboard - Setup Script
echo "🚀 Crypto Wallet Dashboard Setup"
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//')
echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Setup environment file
if [ ! -f .env ]; then
    echo ""
    echo "🔧 Setting up environment file..."
    cp .env.example .env
    echo "✅ Created .env file from template"
else
    echo "✅ .env file already exists"
fi

# Create quick start script
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Crypto Wallet Dashboard..."
npm run dev
EOF

chmod +x start.sh

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env file with your Moralis API key"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""
echo "🔑 Get Moralis API key from: https://moralis.io"
echo "📖 Read README.md for detailed instructions"
echo ""
echo "Happy trading! 💰"
