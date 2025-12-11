# 🚀 Deployment Guide - Render (Free Platform)

## Why Render?

✅ **100% Free tier** for web services  
✅ **Easy deployment** from GitHub  
✅ **Automatic HTTPS** (SSL certificates)  
✅ **Auto-deploy** on git push  
✅ **Persistent storage** for your data  
✅ **No credit card required**

## Step-by-Step Deployment

### 1. Prepare Your Code

Make sure you have:
- ✅ All files committed to a Git repository
- ✅ `package.json` with dependencies
- ✅ `server.js` as your main file

### 2. Push to GitHub

If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit - Club Feedback System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. Deploy on Render

1. **Sign up/Login** to [Render.com](https://render.com) (free account)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository with your code

3. **Configure Service**
   - **Name**: `club-feedback-system` (or any name you like)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or `master`)
   - **Root Directory**: Leave empty (or `.` if needed)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   Add these two variables:
   ```
   ADMIN_USERNAME = your-username-here
   ADMIN_PASSWORD = your-secure-password-here
   ```
   
   ⚠️ **IMPORTANT**: Use a strong password! This protects your admin panel.

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Your app will be live at: `https://your-app-name.onrender.com`

### 4. Access Your Deployed App

- **Feedback Form**: `https://your-app-name.onrender.com/`
- **Admin Panel**: `https://your-app-name.onrender.com/admin`
  - You'll be prompted for username/password (the ones you set in environment variables)

## 🔒 Security Notes

✅ Admin panel is now **password protected**  
✅ Only you can access `/admin` with your credentials  
✅ Public users can only submit feedback (not view it)  
✅ All data is stored securely on Render's servers

## 📊 Viewing Submissions

1. Go to `https://your-app-name.onrender.com/admin`
2. Enter your admin username and password
3. View all feedback submissions
4. Export to CSV/JSON if needed

## 🔄 Updating Your App

Any time you push changes to GitHub:
1. Render automatically detects the change
2. Rebuilds and redeploys your app
3. Your app updates in 2-3 minutes

## 💡 Tips

- **Free tier limitations**: 
  - App spins down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds (wake-up time)
  - Consider upgrading to paid plan for always-on service ($7/month)

- **Data persistence**: 
  - Your `submissions.json` file persists between deployments
  - Data is stored on Render's disk storage

- **Custom domain**: 
  - You can add your own domain in Render settings
  - Free SSL certificate included

## 🆘 Troubleshooting

**App won't start?**
- Check build logs in Render dashboard
- Make sure `package.json` has correct `start` script
- Verify Node.js version compatibility

**Can't access admin panel?**
- Check environment variables are set correctly
- Try clearing browser cache
- Check browser console for errors

**Submissions not saving?**
- Check Render logs for errors
- Verify file permissions (should work automatically)

## Alternative Free Platforms

If Render doesn't work for you:

1. **Railway** (railway.app) - Similar to Render, also free tier
2. **Fly.io** (fly.io) - Free tier with persistent storage
3. **Replit** (replit.com) - Free hosting with easy setup

---

**Need help?** Check Render's documentation: https://render.com/docs

