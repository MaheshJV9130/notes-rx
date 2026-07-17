# Notes RX - Complete System Documentation

## System Overview

Notes RX is a comprehensive Next.js educational notes management platform with:
- **User-facing notes browser** with filtering by year, subject, and chapter
- **PDF viewer** that renders PDFs as blobs (preventing direct downloads)
- **Admin panel** for uploading and organizing notes
- **MongoDB backend** with Mongoose ORM for data persistence

---

## System Architecture

### Architecture Layers

1. **Client Layer (Browser)**
   - User Notes Browser: Filter and search notes
   - Admin Browser: Manage content via admin panel
   - PDF Viewer: View PDFs with zoom and navigation

2. **Next.js Server Layer**
   - Pages: UI routes for viewing notes and admin dashboard
   - API Routes: RESTful endpoints for data operations
   - Middleware: Authentication and request handling
   - PDF Handler: Blob streaming and file uploads

3. **Database Layer (MongoDB)**
   - Notes Collection: Stores note metadata and references
   - Subjects Collection: Organizes courses/subjects by year
   - Chapters Collection: Organizes chapters within subjects
   - AdminUser Collection: Manages admin credentials

4. **File Storage**
   - Local filesystem for uploaded PDFs
   - Blob streaming via API routes
   - No direct file downloads

---

## Database Schema

### Subject Model
```javascript
{
  name: String (required, unique per year/department),
  code: String (required, unique),
  description: String,
  year: Number (1-4, required),
  department: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Chapter Model
```javascript
{
  chapterNumber: Number (required),
  title: String (required),
  description: String,
  subject: ObjectId (ref: Subject, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Note Model
```javascript
{
  title: String (required),
  description: String,
  subject: ObjectId (ref: Subject, required),
  chapter: ObjectId (ref: Chapter, required),
  year: Number (1-4, required),
  pdfFileName: String (required),
  pdfSize: Number,
  uploadedBy: ObjectId (ref: AdminUser, required),
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### AdminUser Model
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ["admin", "superadmin"], default: "admin"),
  isActive: Boolean (default: true),
  department: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Routes

### Authentication Routes

#### POST `/api/auth/register`
Register a new admin user.
```json
Request:
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123",
  "department": "Medical"
}

Response (201):
{
  "message": "Admin user created successfully",
  "data": { /* admin user object */ }
}
```

#### POST `/api/auth/login`
Authenticate admin user and get session token.
```json
Request:
{
  "email": "admin@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "data": {
    "_id": "...",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin",
    "token": "..."
  }
}
```

#### POST `/api/auth/logout`
Logout and clear admin session.

---

### Subject Routes

#### GET `/api/subjects`
Get all subjects.
```json
Response (200):
[
  {
    "_id": "...",
    "name": "Anatomy",
    "code": "ANAT101",
    "year": 1,
    "department": "Medical"
  }
]
```

#### GET `/api/subjects/[year]`
Get subjects for a specific year (1-4).
```json
Response (200):
[
  {
    "_id": "...",
    "name": "Anatomy",
    "code": "ANAT101",
    "year": 1,
    "department": "Medical"
  }
]
```

#### POST `/api/subjects`
Create a new subject (Admin only).
```json
Request:
{
  "name": "Anatomy",
  "code": "ANAT101",
  "year": 1,
  "department": "Medical",
  "description": "Study of human body structure"
}

Response (201):
{
  "message": "Subject created successfully",
  "data": { /* subject object */ }
}
```

---

### Chapter Routes

#### GET `/api/chapters?subject=[subjectId]`
Get chapters for a specific subject.
```json
Response (200):
{
  "data": [
    {
      "_id": "...",
      "chapterNumber": 1,
      "title": "Introduction to Anatomy",
      "subject": { "_id": "...", "name": "Anatomy" }
    }
  ]
}
```

#### POST `/api/chapters`
Create a new chapter (Admin only).
```json
Request:
{
  "chapterNumber": 1,
  "title": "Introduction",
  "description": "Chapter description",
  "subject": "subjectId"
}

Response (201):
{
  "message": "Chapter created successfully",
  "data": { /* chapter object */ }
}
```

---

### Notes Routes

#### GET `/api/notes?year=1&subject=[id]&chapter=[id]`
Get notes with optional filtering.
```json
Response (200):
{
  "data": [
    {
      "_id": "...",
      "title": "Introduction Notes",
      "description": "...",
      "subject": { "name": "Anatomy", "code": "ANAT101" },
      "chapter": { "chapterNumber": 1, "title": "Introduction" },
      "year": 1,
      "views": 42,
      "pdfFileName": "timestamp_random_filename.pdf"
    }
  ]
}
```

#### POST `/api/notes`
Create a new note (Admin only).
```json
Request:
{
  "title": "Chapter Notes",
  "description": "Detailed notes",
  "subject": "subjectId",
  "chapter": "chapterId",
  "year": 1,
  "pdfFileName": "filename.pdf",
  "pdfSize": 524288,
  "uploadedBy": "adminUserId"
}

Response (201):
{
  "message": "Note created successfully",
  "data": { /* note object */ }
}
```

---

### File Upload Routes

#### POST `/api/upload`
Upload a PDF file.
```
Request: FormData with "file" field containing PDF

Response (200):
{
  "message": "File uploaded successfully",
  "filename": "timestamp_random_filename.pdf",
  "size": 524288,
  "type": "application/pdf",
  "originalName": "notes.pdf"
}
```

**Validation:**
- File type: PDF only
- Max size: 50MB

---

### PDF Blob Route

#### GET `/api/pdf/[filename]`
Stream PDF as blob (inline view, not download).
- Returns PDF as blob with `Content-Disposition: inline`
- Security: Prevents directory traversal attacks
- Cache-Control: 1 hour

---

## Frontend Pages

### Public Routes

#### `/` (Home Page)
Landing page with hero section, stats, and CTA buttons.

#### `/notes` (Notes Library)
Main notes browser with filters:
- Year selector (1-4)
- Subject dropdown
- Chapter dropdown
- Search functionality
- Notes grid display

**Features:**
- Dynamic subject loading based on year
- Dynamic chapter loading based on subject
- Real-time search filtering
- Responsive grid layout

#### `/view?file=[filename]` (PDF Viewer)
PDF viewer with controls:
- Previous/Next page navigation
- Direct page input
- Zoom in/out
- Scale percentage display
- Download button
- Blob streaming (no full download stored)

---

### Protected Admin Routes

#### `/admin-login`
Admin login page for authentication.

#### `/admin-register`
Admin registration page (first-time setup).

#### `/admin` (Admin Dashboard)
Main admin panel with tabs:

**1. Upload Notes Tab**
- Form to upload new notes
- Fields: Title, Description, Year, Subject, Chapter, PDF file
- Dynamic chapter loading based on subject
- File validation and upload status

**2. Manage Notes Tab**
- Table view of all uploaded notes
- Shows: Title, Subject, Chapter, Views
- Edit/Delete buttons (for future implementation)

**3. Subjects Tab**
- Subject management (future feature)
- Create, edit, delete subjects
- Organize by year and department

---

## Authentication & Security

### Authentication Flow

1. **Admin Registration**
   - Creates new admin account
   - Password hashed with SHA256
   - Email must be unique

2. **Admin Login**
   - Email/password authentication
   - Returns JWT-like token
   - Token stored in httpOnly cookie
   - Token stored in localStorage for client

3. **Session Protection**
   - Middleware checks `/admin` routes
   - Requires valid token in cookie or Authorization header
   - Redirects to login if unauthorized

### Security Features

- Password hashing (SHA256)
- httpOnly cookies (protect against XSS)
- Directory traversal prevention in file serving
- File type validation (PDF only)
- File size limits (50MB max)
- Session timeout via cookie expiry

**Note:** For production, implement:
- bcrypt for password hashing instead of SHA256
- JWT tokens with expiry
- Rate limiting on auth endpoints
- CSRF protection

---

## Directory Structure

```
/vercel/share/v0-project/
├── app/
│   ├── admin/
│   │   └── page.js (Admin Dashboard)
│   ├── admin-login/
│   │   └── page.js (Admin Login)
│   ├── admin-register/
│   │   └── page.js (Admin Registration)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.js
│   │   │   ├── login/route.js
│   │   │   └── logout/route.js
│   │   ├── subjects/
│   │   │   ├── route.js
│   │   │   └── [year]/route.js
│   │   ├── chapters/route.js
│   │   ├── notes/route.js
│   │   ├── upload/route.js
│   │   └── pdf/[filename]/route.js
│   ├── notes/
│   │   └── page.js (Notes Browser)
│   ├── view/
│   │   └── page.js (PDF Viewer)
│   ├── layout.js (Root Layout)
│   ├── page.js (Home)
│   └── globals.css
├── model/
│   ├── Subject.js
│   ├── Chapter.js
│   ├── Note.js
│   └── AdminUser.js
├── components/
│   ├── Navbar.jsx
│   └── ... (existing components)
├── utils/
│   └── database.js (MongoDB connection)
├── public/
│   ├── uploads/ (PDF storage)
│   ├── system-architecture.svg
│   └── ... (other assets)
├── middleware.js (Auth protection)
├── package.json
└── next.config.mjs
```

---

## Environment Setup

### Required Environment Variables

Create a `.env.local` file:

```env
# MongoDB Connection
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/notes-rx

# Node Environment
NODE_ENV=development

# JWT Secret (for production)
JWT_SECRET=your_super_secret_key_here
```

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set Up MongoDB**
   - Create MongoDB Atlas account
   - Create database and user
   - Get connection string
   - Add to `.env.local`

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   - Server runs on `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## Key Features

### For End Users
✅ Browse notes by Year → Subject → Chapter
✅ Search notes by title/description
✅ View PDFs with zoom and navigation
✅ Inline PDF rendering (not download-based)
✅ View count tracking

### For Admins
✅ Register and login securely
✅ Upload PDF notes with metadata
✅ Organize notes hierarchically
✅ View all uploaded notes
✅ Manage subjects and chapters
✅ Track upload statistics

### Technical Features
✅ MongoDB with Mongoose ORM
✅ Server-side PDF streaming
✅ Client-side PDF rendering (PDF.js)
✅ Protected admin routes
✅ File upload validation
✅ RESTful API design
✅ Error handling
✅ Responsive UI

---

## Data Flow Diagram

```
USER BROWSER
    ↓
[/notes page] ← Filters by Year/Subject/Chapter
    ↓
[/api/subjects] → MongoDB: Get subjects
[/api/chapters] → MongoDB: Get chapters
[/api/notes] → MongoDB: Get notes
    ↓
[Notes Grid] ← Displays note cards with metadata
    ↓
[Click Note] → Navigate to /view?file=filename
    ↓
[PDF Viewer] ← Streams from /api/pdf/[filename]
    ↓
[PDF.js] ← Client-side rendering
    ↓
DISPLAYED IN CANVAS (Blob, not file)

ADMIN BROWSER
    ↓
[/admin-login] ← Email/Password auth
    ↓
[/api/auth/login] → Validate & return token
    ↓
[/admin dashboard]
    ↓
[Upload Tab] → Select Year/Subject/Chapter
    ↓
[/api/upload] → File saved to /public/uploads
    ↓
[/api/notes] POST → Create note record in MongoDB
    ↓
Note available to users ✅
```

---

## Testing the System

### Test Admin Workflow
1. Register at `/admin-register`
2. Login at `/admin-login`
3. Upload a sample PDF note
4. View as user in `/notes`

### Test User Workflow
1. Go to `/notes`
2. Select a year (1-4)
3. Select a subject
4. Click a note
5. View PDF with zoom/navigation

---

## Future Enhancements

- [ ] User accounts for students
- [ ] Favorites and bookmarks
- [ ] Notes rating and reviews
- [ ] Full-text search
- [ ] Print notes functionality
- [ ] Download for offline access
- [ ] Annotations on PDFs
- [ ] Progress tracking
- [ ] Email notifications
- [ ] Mobile app

---

## Support & Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Verify `DB_URL` in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

**PDF Upload Fails**
- Check file size (max 50MB)
- Verify file is valid PDF
- Check `/public/uploads` directory permissions

**Admin Routes Not Protected**
- Clear browser cache
- Check middleware.js configuration
- Verify token in localStorage

---

## License

This project is for educational purposes.

---

## System Architecture Diagram

See `public/system-architecture.svg` for a visual representation of the system architecture.
