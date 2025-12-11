# Club Feedback System

A bilingual (Arabic/English) feedback collection system for club members with an admin panel to view submissions.

## Features

- 📝 Beautiful bilingual feedback form
- 💾 JSON-based storage (easy to upgrade to database)
- 👨‍💼 Admin panel to view all submissions
- 📊 Statistics dashboard
- 🔍 Search functionality
- 📥 Export to CSV/JSON
- 🎨 Modern, responsive UI

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### 3. Access the Application

- **Feedback Form**: http://localhost:3000/
- **Admin Panel**: http://localhost:3000/admin

## Deployment

### 🚀 Recommended: Deploy to Render (FREE)

**See [DEPLOY.md](./DEPLOY.md) for detailed step-by-step instructions!**

Quick steps:
1. Push your code to GitHub
2. Sign up at [Render.com](https://render.com) (free)
3. Create new Web Service → Connect GitHub repo
4. Set environment variables:
   - `ADMIN_USERNAME` = your username
   - `ADMIN_PASSWORD` = your secure password
5. Deploy! Your app will be live in 2-3 minutes

**Your URLs:**
- Feedback Form: `https://your-app.onrender.com/`
- Admin Panel: `https://your-app.onrender.com/admin` (password protected)

### Other Free Options

- **Railway** (railway.app) - Similar to Render
- **Fly.io** (fly.io) - Free tier available
- **Replit** (replit.com) - Easy setup

## Environment Variables

- `PORT`: Server port (default: 3000)

## File Structure

```
.
├── server.js                    # Express backend server
├── interactive_feedback_form.html  # Main feedback form
├── admin.html                   # Admin panel
├── package.json                 # Dependencies
├── submissions.json            # Data storage (auto-created)
└── README.md                   # This file
```

## API Endpoints

- `POST /api/submit-feedback` - Submit feedback form
- `GET /api/submissions` - Get all submissions (admin)
- `DELETE /api/submissions/:id` - Delete a submission

## Security

✅ **Admin panel is password protected** using HTTP Basic Authentication  
✅ Credentials are set via environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)  
✅ Public users can only submit feedback, not view submissions  
✅ All admin API endpoints require authentication

**⚠️ Important**: Change the default admin password before deploying!

## Future Enhancements

- [ ] Add authentication for admin panel
- [ ] Database integration (MongoDB, PostgreSQL)
- [ ] Email notifications for new submissions
- [ ] Analytics and charts
- [ ] Multi-language support expansion

## Support

For issues or questions, please contact the development team.

