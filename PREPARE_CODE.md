# 📋 Step 1: Prepare Your Code - Detailed Guide

This guide will help you prepare your code for deployment on Render.

## ✅ Checklist - What You Need

Before starting, make sure you have these files in your project folder:

- ✅ `server.js` - Your backend server
- ✅ `package.json` - Dependencies list
- ✅ `interactive_feedback_form.html` - Your feedback form
- ✅ `admin.html` - Admin panel
- ✅ `.gitignore` - To exclude unnecessary files

## Step-by-Step Instructions

### Option A: If You DON'T Have Git Installed

#### 1. Install Git

1. Download Git from: https://git-scm.com/download/win
2. Run the installer (use default settings)
3. Restart your terminal/command prompt after installation

#### 2. Verify Git Installation

Open PowerShell or Command Prompt and type:
```bash
git --version
```

You should see something like: `git version 2.x.x`

#### 3. Initialize Git Repository

Open PowerShell in your project folder:
```powershell
cd "C:\Users\omar\OneDrive\Desktop\feedback cscc"
git init
```

#### 4. Configure Git (First Time Only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### 5. Add All Files

```powershell
git add .
```

#### 6. Make Your First Commit

```powershell
git commit -m "Initial commit - Club Feedback System"
```

#### 7. Create Branch (if needed)

```powershell
git branch -M main
```

---

### Option B: If You Already Have Git Installed

Just run these commands in your project folder:

```powershell
# Navigate to your project folder
cd "C:\Users\omar\OneDrive\Desktop\feedback cscc"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit - Club Feedback System"

# Rename branch to main (if needed)
git branch -M main
```

---

## 🔍 Verify Your Files Are Ready

Check that you have these files in your folder:

```
feedback cscc/
├── server.js                    ✅ Backend server
├── package.json                 ✅ Dependencies
├── interactive_feedback_form.html  ✅ Feedback form
├── admin.html                  ✅ Admin panel
├── README.md                   ✅ Documentation
├── DEPLOY.md                   ✅ Deployment guide
├── .gitignore                  ✅ Git ignore file
└── node_modules/               ⚠️  (will be ignored by .gitignore)
```

## ⚠️ Important Notes

1. **node_modules folder**: Don't worry about it - `.gitignore` will exclude it automatically
2. **submissions.json**: This file will be created automatically on the server, so it's okay if it's not committed
3. **Environment variables**: You'll set these later in Render (ADMIN_USERNAME, ADMIN_PASSWORD)

## ✅ You're Done with Step 1!

Once you've:
- ✅ Initialized git repository
- ✅ Added all files
- ✅ Made your first commit

You're ready for **Step 2: Push to GitHub**!

---

## 🆘 Troubleshooting

**"git is not recognized"**
- Install Git from https://git-scm.com/download/win
- Restart your terminal after installation

**"fatal: not a git repository"**
- Run `git init` first

**"nothing to commit"**
- Make sure you're in the right folder
- Check that your files are there with `dir` (Windows) or `ls` (if using Git Bash)

**Need help?** Check the next step in DEPLOY.md for pushing to GitHub!

