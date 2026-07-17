# Quick Setup Guide - Notes RX

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Git

## Step 1: Clone & Install

```bash
git clone https://github.com/MaheshJV9130/notes-rx.git
cd notes-rx
npm install
```

## Step 2: Configure MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with password
4. Get connection string
5. Create `.env.local` file in project root:

```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/notes-rx?retryWrites=true&w=majority
NODE_ENV=development
```

## Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser

## Step 4: Create Admin Account

1. Visit http://localhost:3000/admin-register
2. Fill in registration form
3. Click Register
4. Login at http://localhost:3000/admin-login

## Step 5: Add Sample Data

### Via Admin Panel
1. Go to Admin Dashboard → Upload Notes Tab
2. Select Year, Subject, Chapter
3. Upload PDF file
4. Click "Upload Note"

### Via MongoDB Atlas (Direct)

Insert sample subjects:
```javascript
db.subjects.insertMany([
  {
    name: "Anatomy",
    code: "ANAT101",
    year: 1,
    department: "Medical",
    description: "Study of human body structure"
  },
  {
    name: "Physiology",
    code: "PHYS101",
    year: 1,
    department: "Medical",
    description: "Study of body functions"
  }
])
```

Insert sample chapters:
```javascript
db.chapters.insertMany([
  {
    chapterNumber: 1,
    title: "Introduction to Anatomy",
    subject: ObjectId("..."), // Replace with actual subject ID
    description: "Basic concepts"
  }
])
```

## Step 6: Test User Experience

1. Go to http://localhost:3000/notes
2. Select Year 1
3. Select a subject
4. Click a note to view PDF

## File Structure

```
project/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── admin-login/        # Login page
│   ├── admin-register/     # Registration page
│   ├── notes/              # Notes browser
│   ├── view/               # PDF viewer
│   ├── api/                # Backend routes
│   └── layout.js           # Root layout
├── model/                  # MongoDB schemas
├── utils/                  # Helper functions
├── public/uploads/         # PDF storage
├── middleware.js           # Auth protection
└── package.json
```

## Key Pages

- **Home**: http://localhost:3000
- **Notes Browser**: http://localhost:3000/notes
- **Admin Register**: http://localhost:3000/admin-register
- **Admin Login**: http://localhost:3000/admin-login
- **Admin Dashboard**: http://localhost:3000/admin

## Troubleshooting

### MongoDB Not Connecting
- Check connection string in .env.local
- Verify IP is whitelisted in MongoDB Atlas
- Test with mongosh CLI

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### PDF Upload Not Working
- Check file is valid PDF
- Ensure file size < 50MB
- Verify `/public/uploads` directory exists and is writable

### Admin Routes Not Protected
```bash
# Clear browser cache
# Or delete cookies and localStorage

# Then logout and login again
```

## Production Deployment

### On Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel settings:
   - `DB_URL`
   - `NODE_ENV=production`
4. Deploy

### Environment Variables for Production

Add to Vercel Dashboard:
```
DB_URL = mongodb+srv://...
NODE_ENV = production
JWT_SECRET = generate_a_strong_secret
```

## Security Checklist

- [ ] Change default admin credentials
- [ ] Set up HTTPS
- [ ] Enable MongoDB IP whitelist
- [ ] Set strong JWT secret
- [ ] Enable password hashing (bcrypt)
- [ ] Set up CORS policies
- [ ] Add rate limiting
- [ ] Regular backups

## Next Steps

1. Customize branding (colors, logos)
2. Add more subjects and chapters
3. Upload educational content
4. Set up user accounts (optional)
5. Add notification system
6. Configure email alerts

## Support

For issues, check:
- SYSTEM_DOCUMENTATION.md
- MongoDB logs
- Browser console errors
- Server logs (npm run dev output)

---

**Happy studying! 📚**
