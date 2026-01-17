#!/bin/bash

# Financial Dashboard - Quick Deployment Script
# This script automates the deployment process

echo "🚀 Financial Dashboard Deployment"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
    echo ""
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "⚠️  No Git remote found!"
    echo "Please run this command first (replace YOUR-USERNAME):"
    echo "git remote add origin https://github.com/YOUR-USERNAME/financial-dashboard.git"
    echo ""
    exit 1
fi

# Add and commit changes
echo "📝 Committing changes..."
git add .

# Ask for commit message
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update financial data - $(date +'%B %Y')"
fi

git commit -m "$commit_msg"
echo "✅ Changes committed"
echo ""

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main
echo "✅ Pushed to GitHub"
echo ""

# Build and deploy
echo "🏗️  Building production version..."
npm run build
echo "✅ Build complete"
echo ""

echo "🚀 Deploying to GitHub Pages..."
npm run deploy
echo "✅ Deployment complete!"
echo ""

echo "================================================"
echo "🎉 Success! Your dashboard will be live in 2-3 minutes at:"
echo "https://YOUR-USERNAME.github.io/financial-dashboard/"
echo ""
echo "Don't forget to replace YOUR-USERNAME with your actual GitHub username!"
echo "================================================"
