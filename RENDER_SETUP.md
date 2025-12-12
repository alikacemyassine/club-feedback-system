# 🚀 Quick Setup: Add MongoDB to Render

Your code is now updated to use MongoDB! Just need to add the connection string to Render.

## Your MongoDB Connection String

```
mongodb+srv://feedback-admin:JRvCrIFFdZBLEbdb@club-feedback.jayleav.mongodb.net/club_feedback?retryWrites=true&w=majority
```

## Steps to Add to Render

### 1. Go to Render Dashboard
- Visit: https://dashboard.render.com
- Click on your service: `club-feedback-system`

### 2. Add Environment Variable
1. Click on **"Environment"** tab (left sidebar)
2. Scroll down to **"Environment Variables"** section
3. Click **"Add Environment Variable"**
4. Enter:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://feedback-admin:JRvCrIFFdZBLEbdb@club-feedback.jayleav.mongodb.net/club_feedback?retryWrites=true&w=majority`
5. Click **"Save Changes"**

### 3. Push Updated Code
Run these commands in PowerShell:

```powershell
cd "C:\Users\omar\OneDrive\Desktop\feedback cscc"
git add .
git commit -m "Switch to MongoDB for persistent storage"
git push
```

### 4. Wait for Deployment
- Render will automatically detect the push
- It will redeploy your service (takes 2-3 minutes)
- Watch the logs to see "✅ Connected to MongoDB"

### 5. Verify It Works
1. Go to your feedback form: `https://club-feedback-system.onrender.com/`
2. Submit a test feedback
3. Check admin panel: `https://club-feedback-system.onrender.com/admin`
4. Your data should appear and **persist even after suspend/resume!**

## ✅ That's It!

Your data will now be stored in MongoDB Atlas and will **never be deleted** even if you suspend/resume the Render service!

---

## 🔒 Security Note

The connection string includes your password. It's stored securely in Render's environment variables, but for extra security, you can:
- Change the MongoDB password in Atlas dashboard
- Update the environment variable in Render

