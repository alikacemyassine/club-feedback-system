# 🗄️ MongoDB Atlas Setup Guide (FREE)

Your data was lost because Render's free tier uses **ephemeral storage** - files get deleted when the service restarts. 

**Solution: Use MongoDB Atlas (100% FREE)** - Your data will be stored in the cloud and never lost!

## Why MongoDB Atlas?

✅ **100% Free** (512MB storage - enough for thousands of submissions)  
✅ **Data never gets deleted** - stored in MongoDB's cloud  
✅ **Works with Render free tier** - no issues with suspend/resume  
✅ **Easy to set up** - 5 minutes  
✅ **No credit card required**

## Step-by-Step Setup

### 1. Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Verify your email

### 2. Create a Free Cluster

1. **Select "Build a Database"**
2. Choose **"FREE" (M0)** tier
3. **Cloud Provider**: Choose any (AWS, Google Cloud, or Azure)
4. **Region**: Choose closest to you (or Render's region)
5. **Cluster Name**: `club-feedback` (or any name)
6. Click **"Create"** (takes 3-5 minutes)

### 3. Create Database User

1. In the **"Database Access"** section (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. **Username**: `feedback-admin` (or any username)
5. **Password**: Click "Autogenerate Secure Password" or create your own
6. **⚠️ COPY THE PASSWORD** - you'll need it!
7. **Database User Privileges**: Select **"Read and write to any database"**
8. Click **"Add User"**

### 4. Whitelist IP Address

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - This allows Render to connect
   - For production, you can restrict to Render's IPs later
4. Click **"Confirm"**

### 5. Get Connection String

1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 5.5 or later
6. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Replace `<username>` and `<password>`** with your database user credentials
8. **Add database name** at the end: `/?retryWrites=true&w=majority` → `/club_feedback?retryWrites=true&w=majority`

**Final connection string should look like:**
```
mongodb+srv://feedback-admin:YourPassword123@cluster0.xxxxx.mongodb.net/club_feedback?retryWrites=true&w=majority
```

### 6. Update Your Render Service

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your service
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key**: `MONGODB_URI`
   - **Value**: Your connection string from step 5
6. Click **"Save Changes"**

### 7. Update Your Code

1. **Rename `server.js` to `server-old.js`** (backup)
2. **Rename `server-mongodb.js` to `server.js`**
3. **Push to GitHub:**
   ```powershell
   git add .
   git commit -m "Switch to MongoDB for persistent storage"
   git push
   ```
4. Render will automatically redeploy!

## ✅ Verify It Works

1. Wait for Render to finish deploying (2-3 minutes)
2. Go to your feedback form: `https://club-feedback-system.onrender.com/`
3. Submit a test feedback
4. Check admin panel: `https://club-feedback-system.onrender.com/admin`
5. Your data should appear and **persist even after suspend/resume!**

## 🔒 Security Notes

- Your MongoDB password is stored securely in Render's environment variables
- Database is only accessible from whitelisted IPs
- Free tier is perfect for your use case

## 📊 What Changed?

- ✅ Data now stored in MongoDB Atlas (cloud database)
- ✅ Data persists even when Render service restarts
- ✅ No more data loss on suspend/resume
- ✅ Free forever (512MB is plenty for thousands of submissions)

## 🆘 Troubleshooting

**"MongoDB connection error"**
- Check your connection string is correct
- Verify username/password in connection string
- Make sure IP is whitelisted (0.0.0.0/0)

**"Authentication failed"**
- Double-check username and password in connection string
- Make sure database user has read/write permissions

**Data still not persisting?**
- Check Render logs for MongoDB connection errors
- Verify MONGODB_URI environment variable is set correctly

---

**Your data will now be safe forever!** 🎉

