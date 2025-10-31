# 🚀 Coal Ordering System - Deployment Guide

## Option 1: Vercel Web Interface (Recommended)

Since we're having npm permission issues, let's use Vercel's web interface:

### Steps:
1. **Visit**: https://vercel.com
2. **Sign up/Login** with GitHub, GitLab, or Bitbucket
3. **Import Project**:
   - Click "New Project"
   - Import from Git Repository
   - Connect your GitHub account
   - Select this repository

### If you don't have Git set up:
1. **Create a ZIP file** of your project
2. **Upload to GitHub**:
   - Go to https://github.com
   - Click "New Repository"
   - Name it "coal-ordering-system"
   - Upload all your files
3. **Import to Vercel** from GitHub

---

## Option 2: GitHub Pages (No CLI needed)

### Steps:
1. **Go to GitHub.com**
2. **Create new repository**: "coal-ordering-system"
3. **Upload files**:
   - Drag and drop all your .html, .js, .css files
   - Include vercel.json and other config files
4. **Enable GitHub Pages**:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
5. **Your site will be live at**: 
   `https://yourusername.github.io/coal-ordering-system`

---

## Option 3: Surge.sh (Simple Upload)

### Steps:
1. **Install Surge globally** (if npm works):
   ```bash
   npm install -g surge
   ```
2. **Or use npx**:
   ```bash
   npx surge
   ```
3. **Follow the prompts**:
   - Email: your-email@example.com
   - Password: create a password
   - Domain: coal-ordering-demo.surge.sh (or custom)

---

## Option 4: Manual Vercel Deployment

### Create deployment package:
1. **Create a folder** called "deployment"
2. **Copy these files** into it:
   - index.html
   - login.html
   - customer.html
   - admin.html
   - url-sync.js
   - vercel.json
3. **ZIP the folder**
4. **Upload to Vercel** via web interface

---

## 🔧 Fix npm permissions (Optional)

If you want to fix npm for future use:

```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
npm install -g vercel
```

---

## 🌐 Your App Features

Once deployed, your app will have:
- ✅ **Global Access**: Available worldwide
- ✅ **HTTPS**: Secure connections
- ✅ **Fast CDN**: Quick loading everywhere
- ✅ **Cross-Device Sync**: Data syncs between devices
- ✅ **Mobile Friendly**: Works on phones/tablets
- ✅ **Professional URL**: Easy to share

---

## 📱 Testing Cross-Device Sync

After deployment:
1. **Open on phone**: Visit your deployed URL
2. **Create customer account** on phone
3. **Place an order** on phone
4. **Open on laptop**: Visit same URL
5. **Go to admin portal** - see the order from phone
6. **Approve/reject** on laptop
7. **Check phone** - see status update automatically

Your coal ordering system will be fully functional across all devices! 🎉