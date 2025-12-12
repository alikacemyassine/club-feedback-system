# 🔧 MongoDB Authentication Error - Troubleshooting

## Error: "bad auth : authentication failed"

This means MongoDB can't authenticate with the username/password you provided.

## Common Causes & Solutions

### 1. **Password Has Special Characters** ⚠️

If your password contains special characters (like `@`, `#`, `%`, `&`, etc.), they need to be **URL encoded** in the connection string.

**Your password**: `pewdiepie1` (no special chars, so this should be fine)

### 2. **Wrong Username or Password**

Double-check in MongoDB Atlas:
1. Go to: https://cloud.mongodb.com
2. Click **"Database Access"** (left sidebar)
3. Find your user: `feedback-admin`
4. Click the **pencil icon** to edit
5. Verify the username is exactly: `feedback-admin`
6. If password is wrong, click **"Edit Password"** and set a new one

### 3. **Connection String Format**

Make sure your connection string looks exactly like this:

```
mongodb+srv://feedback-admin:pewdiepie1@club-feedback.jayleav.mongodb.net/club_feedback?retryWrites=true&w=majority
```

**Important parts:**
- Username: `feedback-admin`
- Password: `pewdiepie1` (no spaces, no encoding needed)
- Database: `/club_feedback` (before the `?`)
- Options: `?retryWrites=true&w=majority`

### 4. **Reset the Password** (Recommended)

If you're not sure about the password:

1. Go to MongoDB Atlas → **"Database Access"**
2. Find `feedback-admin` user
3. Click **"Edit"** (pencil icon)
4. Click **"Edit Password"**
5. Enter a **simple password** (no special characters):
   - Example: `Feedback2024!` or `ClubFeedback123`
6. Click **"Update User"**
7. **Copy the new password**
8. Update Render environment variable with new password

### 5. **Check IP Whitelist**

Make sure Render can connect:

1. Go to MongoDB Atlas → **"Network Access"**
2. Make sure `0.0.0.0/0` is in the list (allows all IPs)
3. If not, click **"Add IP Address"** → **"Allow Access from Anywhere"**

### 6. **Test Connection String**

Try this format in Render's environment variable:

```
mongodb+srv://feedback-admin:pewdiepie1@club-feedback.jayleav.mongodb.net/club_feedback?retryWrites=true&w=majority
```

**Make sure:**
- No spaces
- No extra characters
- Password is exactly as you set it in Atlas
- Username matches exactly

## Quick Fix Steps

### Option A: Reset Password (Easiest)

1. **MongoDB Atlas** → Database Access → Edit `feedback-admin`
2. **Change password** to something simple: `Feedback123!`
3. **Update Render** environment variable:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://feedback-admin:Feedback123!@club-feedback.jayleav.mongodb.net/club_feedback?retryWrites=true&w=majority`
4. **Save** and wait for redeploy

### Option B: Create New User

1. **MongoDB Atlas** → Database Access → Add New Database User
2. **Username**: `render-user`
3. **Password**: `Render2024!` (or any simple password)
4. **Privileges**: Read and write to any database
5. **Copy connection string** from Atlas (Connect → Connect your application)
6. **Replace** username/password in connection string
7. **Add** `/club_feedback` before the `?`
8. **Update Render** with new connection string

## Verify Connection String Format

Your connection string should be:
```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/[DATABASE]?retryWrites=true&w=majority
```

Example:
```
mongodb+srv://feedback-admin:pewdiepie1@club-feedback.jayleav.mongodb.net/club_feedback?retryWrites=true&w=majority
```

## Still Not Working?

1. **Check Render logs** - look for the exact connection string being used
2. **Verify in MongoDB Atlas**:
   - User exists: `feedback-admin`
   - Password is correct
   - IP is whitelisted: `0.0.0.0/0`
3. **Try creating a new user** with a simpler password
4. **Double-check** the connection string in Render environment variables (no extra spaces, correct format)

---

**Most likely issue**: Password mismatch. Reset it in Atlas and update Render! 🔑

