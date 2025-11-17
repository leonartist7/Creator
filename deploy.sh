#!/bin/bash

# Digital Product Creator - Quick Deployment Script

echo "🚀 Digital Product Creator - Deployment Helper"
echo "=============================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found"
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Choose deployment option
echo "Select deployment option:"
echo "1) Deploy Backend to Vercel"
echo "2) Deploy Frontend to Vercel"
echo "3) Deploy Both to Vercel"
echo "4) Show environment variables needed"
echo "5) Exit"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo "📦 Deploying Backend..."
        cd backend
        vercel --prod
        ;;
    2)
        echo "🎨 Deploying Frontend..."
        cd frontend
        vercel --prod
        ;;
    3)
        echo "📦 Deploying Backend..."
        cd backend
        BACKEND_URL=$(vercel --prod 2>&1 | tail -n 1)
        echo "Backend deployed to: $BACKEND_URL"

        echo ""
        echo "🎨 Deploying Frontend..."
        cd ../frontend
        FRONTEND_URL=$(vercel --prod 2>&1 | tail -n 1)
        echo "Frontend deployed to: $FRONTEND_URL"

        echo ""
        echo "✅ Both deployed successfully!"
        echo ""
        echo "⚠️  IMPORTANT: Update these environment variables in Vercel Dashboard:"
        echo "Backend FRONTEND_URL: $FRONTEND_URL"
        echo "Frontend VITE_API_URL: $BACKEND_URL"
        ;;
    4)
        echo ""
        echo "📋 Environment Variables Needed:"
        echo ""
        echo "BACKEND (.env):"
        echo "---------------"
        echo "SUPABASE_URL=https://rztxxajwpcszbgsitnup.supabase.co"
        echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        echo "SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        echo "ANTHROPIC_API_KEY=sk-ant-api03-9Yu7zZegvUfTuE3VHU6HGGCz35Z4..."
        echo "FRONTEND_URL=https://your-frontend.vercel.app"
        echo "NODE_ENV=production"
        echo ""
        echo "FRONTEND (.env):"
        echo "----------------"
        echo "VITE_API_URL=https://your-backend.vercel.app"
        echo "VITE_SUPABASE_URL=https://rztxxajwpcszbgsitnup.supabase.co"
        echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"
echo "📝 Next steps:"
echo "1. Configure environment variables in Vercel Dashboard"
echo "2. Test your deployment"
echo "3. Update CORS settings if needed"
