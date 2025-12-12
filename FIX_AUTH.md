# 🔐 Fix MongoDB Authentication Error

## The Problem
MongoDB is rejecting your username/password. This usually means:
- Password is incorrect
- Username doesn't match
- Connection string format is wrong

## Quick Fix (5 minutes)

### Step 1: Verify/Reset Password in MongoDB Atlas

1. Go to: https://cloud.mongodb.com
2. Login to your account
3. Click **"Database Access"** (left sidebar)
4. Find the user: `feedback-admin`
5. Click the **pencil icon** (Edit) next to it
6. Click **"Edit Password"**
7. Set a **new simple password** (no special characters):
   - Example: `Feedback2024` or `Club123456`
8. **Copy the new password** - you'll need it!
9. Click **"Update User"**

### Step 2: Update Render Environment Variable

1. Go to: https://dashboard.render.com
2. Click your service: `club-feedback-system`
3. Go to **"Environment"** tab
4. Find `MONGODB_URI` variable
5. Click **"Edit"** (or delete and recreate)
6. Update the value with your **new password**:

```
mongodb+srv://feedback-admin:YOUR_NEW_PASSWORD@club-feedback.jayleav.mongodb.net/club_feedback?retryWrites=true&w=majority
```

**Replace `YOUR_NEW_PASSWORD` with the password you just set!**

7. Click **"Save Changes"**
8. Render will automatically redeploy

### Step 3: Verify It Works

1. Wait 2-3 minutes for deployment
2. Check Render logs - you should see: `✅ Connected to MongoDB`
3. Test your feedback form

## Alternative: Create New User

If the above doesn't work, create a fresh user:

1. **MongoDB Atlas** → Database Access → **"Add New Database User"**
2. **Username**: `render-user` (or any name)
3. **Password**: Click **"Autogenerate Secure Password"** or create: `Render2024!`
4. **Database User Privileges**: Select **"Read and write to any database"**
5. Click **"Add User"**
6. **Copy the password** immediately!
7. Go to **"Database"** → **"Connect"** → **"Connect your application"**
8. Copy the connection string
9. Replace `<username>` and `<password>` with your new user credentials
10. Add `/club_feedback` before the `?` in the connection string
11. Update Render's `MONGODB_URI` with the new connection string

## Check IP Whitelist

Make sure Render can connect:

1. MongoDB Atlas → **"Network Access"**
2. Make sure `0.0.0.0/0` is listed (allows all IPs)
3. If not, click **"Add IP Address"** → **"Allow Access from Anywhere"**

## Connection String Format

Your connection string should look exactly like this:

```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Important:**
- No spaces
- Password goes directly after the `:` (no encoding needed for simple passwords)
- Database name (`club_feedback`) goes before the `?`
- No extra characters

---

**Most likely fix**: Reset the password in MongoDB Atlas and update Render! 🔑

