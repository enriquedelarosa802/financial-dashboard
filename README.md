# 💰 Personal Financial Dashboard

A private, interactive financial dashboard for tracking wealth building progress toward your $180k goal by August 2030.

## 🎯 Features

- **Interactive Scenario Planner**: Adjust savings, debt payments, and see instant projections
- **Real-time Calculations**: Debt-free date, net worth projections, and goal progress
- **Beautiful Visualizations**: Charts for investments, spending, debt, and net worth
- **Mobile-Friendly**: Works on iPhone, iPad, MacBook, and desktop
- **100% Private**: Your data never leaves your control
- **Completely Free**: No hosting costs, forever

## 📱 Installation & Deployment

### Step 1: Set Up GitHub Repository

1. **Create a new private repository on GitHub**:
   - Go to https://github.com/new
   - Name it: `financial-dashboard` (or any name you prefer)
   - **IMPORTANT**: Select "Private" repository
   - Do NOT initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Copy the repository URL** (it will look like: `https://github.com/YOUR-USERNAME/financial-dashboard.git`)

### Step 2: Deploy the Dashboard

Open Terminal (Mac) or Command Prompt (Windows) and run these commands one by one:

```bash
# Navigate to the project folder (this folder should contain this README)
cd /path/to/financial-dashboard

# Initialize git repository
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit - Financial Dashboard"

# Link to your GitHub repository (replace YOUR-USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/financial-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages (Private Access)

1. Go to your repository on GitHub: `https://github.com/YOUR-USERNAME/financial-dashboard`
2. Click "Settings" (top right)
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select:
   - **Branch**: `gh-pages` (you'll need to create this branch first - see below)
   - **Folder**: `/root`
5. Click "Save"

**Creating the gh-pages branch:**

```bash
# Install dependencies
npm install

# Build the production version
npm run build

# Install gh-pages deployment tool
npm install --save-dev gh-pages

# Deploy to GitHub Pages
npm run deploy
```

After a few minutes, your dashboard will be live at:
`https://YOUR-USERNAME.github.io/financial-dashboard/`

**Important**: Because your repository is private, only YOU (when logged into GitHub) can access this URL. Perfect for privacy!

### Step 4: Access on All Your Devices

#### On iPhone/iPad:
1. Open Safari
2. Go to your dashboard URL
3. Tap the Share button (square with arrow)
4. Tap "Add to Home Screen"
5. Name it "Wealth Tracker" or similar
6. Tap "Add"

Now it works like a native app!

#### On MacBook/Desktop:
1. Open Chrome or Safari
2. Go to your dashboard URL
3. Bookmark it for easy access
4. In Chrome: Click the install icon in the address bar to install as PWA

## 📊 Monthly Data Updates

Every month, update your financial data:

1. Open `src/financialData.js` in any text editor
2. Update the numbers in the `currentBalances` section:
   ```javascript
   currentBalances: {
     rothIRA: 15429.31,        // ← Update this
     chaseChecking: 2368.22,   // ← Update this
     tdSavings: 3000.17,       // ← Update this
     studentLoans: 22250,      // ← Update this
     autoLoan: 20850,          // ← Update this
   },
   ```

3. Add new entries to the history arrays:
   ```javascript
   rothIRAHistory: [
     // Add your new month like this:
     { month: 'Jan 26', value: 16500, contributions: 14500, gain: 2000 },
   ],
   ```

4. Save the file

5. Deploy the update:
   ```bash
   git add .
   git commit -m "Updated financial data for [Month Year]"
   git push
   npm run deploy
   ```

Wait 2-3 minutes, refresh your dashboard, and see your updated numbers!

## 🎮 Using the Scenario Planner

Click "🎯 Show Scenario Planner" to explore what-if scenarios:

- **Adjust monthly Roth IRA contributions**: See how maxing out ($583/mo) impacts your goal
- **Add extra debt payments**: Watch your debt-free date move up
- **Model salary increases**: See how a $100k salary accelerates wealth building
- **Change investment returns**: Test conservative (5%) vs aggressive (10%) scenarios

The charts update **instantly** as you move the sliders!

## 🔒 Privacy & Security

- ✅ **Private Repository**: Code is only visible to you
- ✅ **Private Access**: Only accessible when logged into GitHub
- ✅ **No Tracking**: No analytics, no third-party scripts
- ✅ **Your Data**: All data stored locally in your repository
- ✅ **Zero Cost**: GitHub Pages is 100% free for private repos

## 🛠 Troubleshooting

**Dashboard not loading?**
- Make sure you're logged into GitHub
- Clear browser cache and refresh
- Check GitHub Pages is enabled in Settings

**Data not updating?**
- Make sure you ran `npm run deploy` after updating
- Wait 2-3 minutes for GitHub Pages to rebuild
- Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+F5)

**Forgot your GitHub URL?**
- Go to github.com and click your profile
- Find "financial-dashboard" in your repositories
- The URL is: `https://YOUR-USERNAME.github.io/financial-dashboard/`

## 📚 Next Steps

1. **Customize Your Goals**: Edit the `wealthGoal` in `src/financialData.js`
2. **Update Monthly**: Set a calendar reminder to update your data
3. **Experiment**: Use the Scenario Planner to optimize your strategy
4. **Share Progress**: Take screenshots to track your journey (but keep the URL private!)

## 💪 Built For

**Enrique's Aggressive Wealth Building Journey**
- 40-year time horizon
- Debt avalanche strategy
- $180k net worth target by August 2030
- Maximum Roth IRA contributions
- Data-driven decision making

---

**Need Help?** Create an issue in your repository or ask Claude for assistance!

**Built with**: React • Recharts • GitHub Pages • Love for financial freedom 🚀
