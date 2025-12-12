# 🔧 Admin Panel Loading Issue - Troubleshooting

## The Problem

Admin panel shows "Loading..." but MongoDB has data. This is usually an authentication issue.

## Quick Fixes

### 1. **Check Browser Console**

Open browser DevTools (F12) → Console tab. Look for errors like:
- `401 Unauthorized`
- `CORS error`
- `Network error`

### 2. **Verify Authentication**

When you access `/admin`, the browser should prompt for:
- **Username**: Your `ADMIN_USERNAME` (from Render env vars)
- **Password**: Your `ADMIN_PASSWORD` (from Render env vars)

**If no prompt appears:**
- Clear browser cache
- Try incognito/private window
- Check if credentials are saved incorrectly

### 3. **Test API Directly**

Try accessing this URL directly (you'll be prompted for credentials):
```
https://club-feedback-system.onrender.com/api/submissions
```

You should see JSON data. If you see an error, that's the issue.

### 4. **Check Render Environment Variables**

Make sure these are set in Render:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `MONGODB_URI`

### 5. **Check CORS Settings**

If you see CORS errors, verify:
- `ALLOWED_ORIGINS` includes your Render URL
- Or remove `ALLOWED_ORIGINS` to use default

## Common Issues

### Issue 1: Credentials Not Saved
**Solution**: Enter credentials again when prompted

### Issue 2: Wrong Credentials
**Solution**: Check Render environment variables match what you're entering

### Issue 3: CORS Blocking
**Solution**: Add your domain to `ALLOWED_ORIGINS` or remove the restriction

### Issue 4: API Not Responding
**Solution**: Check Render logs for errors

## Debug Steps

1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload admin page
4. Look for `/api/submissions` request
5. Check:
   - Status code (should be 200, not 401)
   - Response (should be JSON with submissions)
   - Headers (check for auth headers)

## If Still Not Working

Check Render logs:
1. Go to Render dashboard
2. Click your service
3. Go to "Logs" tab
4. Look for errors when accessing `/api/submissions`

---

**Most likely**: You need to enter admin credentials when prompted! 🔐

