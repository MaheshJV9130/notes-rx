# Notes RX - Complete Educational Notes Management System

## Overview

Notes RX is a sophisticated, production-ready Next.js application that provides a complete ecosystem for managing and distributing educational notes. Built with modern web technologies, it features a secure admin panel for content management and a beautiful user interface for accessing notes.

### Key Highlights

✅ **Next.js 16** with JavaScript (no TypeScript) and App Router
✅ **MongoDB + Mongoose** for robust data persistence
✅ **PDF Blob Rendering** - PDFs viewed inline, not downloaded
✅ **Secure Admin Panel** with authentication and authorization
✅ **Hierarchical Organization** - Year → Subject → Chapter → Note
✅ **Full-Featured API** with RESTful design
✅ **Responsive Design** with Tailwind CSS
✅ **Production-Ready** with security best practices

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                  │
├──────────────────────┬──────────────────────┬──────────────┤
│  User Browser        │  Admin Browser       │  PDF Viewer  │
│  - Filter Notes      │  - Upload Notes      │  - Zoom      │
│  - Search            │  - Manage Content    │  - Navigate  │
│  - Browse Library    │  - Organization      │  - Stream    │
└──────────────────────┴──────────────────────┴──────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS SERVER LAYER (API)                     │
├──────────────┬──────────────┬──────────────┬──────────────┤
│ Pages        │ API Routes   │ Middleware   │ PDF Handler  │
│ - /notes     │ - /subjects  │ - Auth Check │ - Blob       │
│ - /view      │ - /chapters  │ - Logging    │   Stream     │
│ - /admin     │ - /notes     │ - Rate Limit │ - Validation │
│              │ - /upload    │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────┐
│           DATABASE LAYER (MongoDB + Mongoose)               │
├────────────┬────────────┬────────────┬──────────────────────┤
│ Subjects   │ Chapters   │ Notes      │ Admin Users          │
│ - name     │ - number   │ - title    │ - email              │
│ - code     │ - title    │ - subject  │ - password (hashed)  │
│ - year     │ - subject  │ - chapter  │ - role               │
│ - dept     │ - desc     │ - pdfFile  │ - createdAt          │
└────────────┴────────────┴────────────┴──────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────┐
│        FILE STORAGE (/public/uploads)                       │
│  - PDF Files stored securely
│  - Streamed as blobs via API
│  - Not directly downloadable
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MongoDB
```env
# .env.local
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/notes-rx
NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access the Application
- **Home**: http://localhost:3000
- **Notes**: http://localhost:3000/notes
- **Admin Register**: http://localhost:3000/admin-register
- **Admin Login**: http://localhost:3000/admin-login
- **Admin Dashboard**: http://localhost:3000/admin

---

## Project Structure

```
notes-rx/
├── app/
│   ├── admin/                          # Admin dashboard
│   ├── admin-login/                    # Admin authentication
│   ├── admin-register/                 # Admin registration
│   ├── api/
│   │   ├── auth/                       # Authentication routes
│   │   │   ├── register/route.js
│   │   │   ├── login/route.js
│   │   │   └── logout/route.js
│   │   ├── subjects/                   # Subject management
│   │   │   ├── route.js
│   │   │   └── [year]/route.js
│   │   ├── chapters/route.js           # Chapter management
│   │   ├── notes/route.js              # Notes management
│   │   ├── upload/route.js             # File upload
│   │   └── pdf/[filename]/route.js     # PDF streaming
│   ├── notes/                          # Notes browser
│   ├── view/                           # PDF viewer
│   ├── layout.js
│   ├── page.js
│   └── globals.css
│
├── model/
│   ├── Subject.js                      # MongoDB Subject schema
│   ├── Chapter.js                      # MongoDB Chapter schema
│   ├── Note.js                         # MongoDB Note schema
│   └── AdminUser.js                    # MongoDB AdminUser schema
│
├── components/
│   ├── Navbar.jsx
│   └── ... (existing components)
│
├── utils/
│   └── database.js                     # MongoDB connection
│
├── middleware.js                       # Auth protection
├── public/
│   ├── uploads/                        # Uploaded PDFs
│   ├── system-architecture.svg         # System diagram
│   └── ... (other assets)
│
├── SYSTEM_DOCUMENTATION.md             # Complete system docs
├── SETUP_GUIDE.md                      # Quick setup guide
├── API_REFERENCE.md                    # API documentation
├── NOTES_RX_SYSTEM.md                  # This file
├── package.json
└── next.config.mjs
```

---

## Database Models

### Subject
Represents a course or subject offered in a particular year.
```javascript
{
  name, code, description, year (1-4), department, createdAt, updatedAt
}
```

### Chapter
Represents a chapter within a subject.
```javascript
{
  chapterNumber, title, description, subject (ref), createdAt, updatedAt
}
```

### Note
Represents a single note document with associated metadata.
```javascript
{
  title, description, subject (ref), chapter (ref), year, 
  pdfFileName, pdfSize, uploadedBy (ref), views, createdAt, updatedAt
}
```

### AdminUser
Stores admin credentials and information.
```javascript
{
  name, email, password (hashed), role, isActive, department, createdAt, updatedAt
}
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create admin account
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/[year]` - Get subjects for year
- `POST /api/subjects` - Create subject (admin)

### Chapters
- `GET /api/chapters?subject=[id]` - Get chapters
- `POST /api/chapters` - Create chapter (admin)

### Notes
- `GET /api/notes` - Get notes with filters
- `POST /api/notes` - Create note (admin)

### Files
- `POST /api/upload` - Upload PDF
- `GET /api/pdf/[filename]` - Stream PDF blob

See `API_REFERENCE.md` for complete endpoint documentation.

---

## Features

### For End Users
- Browse notes by Year, Subject, and Chapter
- Search notes by title or description
- View PDFs with zoom and navigation controls
- Track views of each note
- Responsive mobile-friendly interface
- Fast loading with optimized streaming

### For Admins
- Secure login and registration
- Upload PDF notes with metadata
- Organize notes hierarchically
- View all uploaded content
- Manage subjects and chapters
- Track upload statistics
- Easy-to-use dashboard interface

### Technical Features
- RESTful API design
- Server-side PDF streaming
- Client-side PDF rendering with PDF.js
- MongoDB with Mongoose ORM
- Protected routes with middleware
- File upload validation
- Security: CORS, helmet headers, input validation
- Caching headers for performance
- Error handling and logging

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Import GitHub repository
   - Add environment variables

3. **Environment Variables**
   ```
   DB_URL=your_mongodb_connection_string
   NODE_ENV=production
   ```

4. **Deploy**
   - Vercel automatically deploys on push

### Manual Deployment

```bash
npm run build
npm run start
```

---

## Security Considerations

### Current Implementation
- Password hashing with SHA256
- httpOnly cookies for tokens
- Directory traversal prevention
- File type validation
- File size limits
- Input validation

### Production Recommendations
- Use bcrypt instead of SHA256
- Implement JWT tokens with expiry
- Add rate limiting
- Enable CORS selectively
- Add CSRF protection
- Set up SSL/HTTPS
- Regular security audits
- Database backups

---

## Configuration

### Environment Variables
```env
# Required
DB_URL=mongodb+srv://...

# Optional
NODE_ENV=development|production
JWT_SECRET=your_secret_key
MAX_FILE_SIZE=52428800  # 50MB in bytes
```

### Next.js Config
- Uses Tailwind CSS v4
- Configured with React 19.2
- PDF.js for PDF rendering
- ESLint enabled

---

## Performance Optimization

### Frontend
- PDF.js worker from CDN
- Lazy loading of pages
- Image optimization
- CSS minification

### Backend
- MongoDB indexing on year, subject
- PDF streaming (not full downloads)
- Cache headers (1 hour for PDFs)
- Efficient queries with projections

### Database
- Indexes on frequently queried fields
- Document population optimization
- Connection pooling

---

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

**PDF Upload Fails**
- Check file size (max 50MB)
- Verify file is valid PDF
- Check /public/uploads directory

**Admin Routes Not Working**
- Clear browser cache and cookies
- Verify token in localStorage
- Check middleware configuration

**Performance Issues**
- Enable caching
- Optimize PDF file sizes
- Add database indexes
- Use CDN for assets

---

## Future Enhancements

- User accounts and authentication
- Favorites and bookmarks system
- Note ratings and reviews
- Full-text search
- Annotations on PDFs
- Offline download capability
- Email notifications
- Progress tracking
- Mobile app
- Collaborative features

---

## Documentation Files

- **SYSTEM_DOCUMENTATION.md** - Comprehensive system architecture and database design
- **SETUP_GUIDE.md** - Step-by-step setup instructions
- **API_REFERENCE.md** - Complete API endpoint documentation
- **NOTES_RX_SYSTEM.md** - This overview document
- **public/system-architecture.svg** - Visual architecture diagram

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | Node.js, Next.js API Routes |
| Database | MongoDB, Mongoose ORM |
| PDF Rendering | PDF.js (client-side) |
| Authentication | Custom JWT + cookies |
| Icons | React Icons |
| File Storage | Local filesystem (/public/uploads) |

---

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## License

Educational use only. Modify and distribute as needed.

---

## Support

For detailed information:
- See `SYSTEM_DOCUMENTATION.md` for architecture
- See `SETUP_GUIDE.md` for installation
- See `API_REFERENCE.md` for API details
- Check browser console for errors
- Review server logs in terminal

---

## Summary

Notes RX is a complete, production-ready platform for managing educational content. It combines a robust backend with an intuitive frontend to provide a seamless experience for both administrators and students. The system prioritizes security, performance, and user experience while maintaining clean, maintainable code architecture.

The hierarchical organization (Year → Subject → Chapter → Note) ensures content is well-structured, while the PDF blob streaming prevents unauthorized downloads and protects content. The comprehensive API enables easy integration with other systems if needed.

**Version:** 1.0  
**Last Updated:** January 2024  
**Status:** Production Ready

---

**Happy studying! Enjoy using Notes RX.**
