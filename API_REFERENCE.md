# Notes RX - API Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication
- Admin routes require token in cookie or Authorization header
- Token obtained from login endpoint
- Stored in `adminToken` httpOnly cookie

---

## Authentication Endpoints

### Register Admin User
**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "department": "Medical Studies"
}
```

**Response (201):**
```json
{
  "message": "Admin user created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "department": "Medical Studies",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `400`: Missing required fields
- `409`: Email already registered
- `500`: Server error

---

### Login Admin User
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "department": "Medical Studies",
    "isActive": true,
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `400`: Missing credentials
- `401`: Invalid credentials
- `403`: Account deactivated
- `500`: Server error

---

### Logout Admin User
**Endpoint:** `POST /auth/logout`

**Request:** No body required

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

**Note:** Clears httpOnly cookie

---

## Subject Endpoints

### Get All Subjects
**Endpoint:** `GET /subjects`

**Query Parameters:** None

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Anatomy",
    "code": "ANAT101",
    "year": 1,
    "department": "Medical",
    "description": "Study of human body structure",
    "createdAt": "2024-01-10T08:00:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Physiology",
    "code": "PHYS101",
    "year": 1,
    "department": "Medical",
    "description": "Study of body functions",
    "createdAt": "2024-01-10T08:00:00Z"
  }
]
```

---

### Get Subjects by Year
**Endpoint:** `GET /subjects/[year]`

**Parameters:**
- `year` (path): 1, 2, 3, or 4

**Example:**
```
GET /subjects/1
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Anatomy",
    "code": "ANAT101",
    "year": 1,
    "department": "Medical",
    "description": "Study of human body structure"
  }
]
```

**Errors:**
- `404`: No subjects found for year
- `500`: Server error

---

### Create Subject (Admin Only)
**Endpoint:** `POST /subjects`

**Headers:**
```
Authorization: Bearer [token]
```

**Request:**
```json
{
  "name": "Pharmacology",
  "code": "PHARM101",
  "year": 2,
  "department": "Medical",
  "description": "Study of drugs and their effects"
}
```

**Response (201):**
```json
{
  "message": "Subject created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Pharmacology",
    "code": "PHARM101",
    "year": 2,
    "department": "Medical",
    "description": "Study of drugs and their effects",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `400`: Missing required fields
- `409`: Subject code already exists
- `500`: Server error

---

## Chapter Endpoints

### Get Chapters by Subject
**Endpoint:** `GET /chapters?subject=[subjectId]`

**Query Parameters:**
- `subject` (required): Subject ObjectId

**Example:**
```
GET /chapters?subject=507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "chapterNumber": 1,
      "title": "Introduction to Anatomy",
      "description": "Basic concepts and overview",
      "subject": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Anatomy",
        "code": "ANAT101"
      },
      "createdAt": "2024-01-10T08:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439021",
      "chapterNumber": 2,
      "title": "Skeletal System",
      "description": "Bones and joints",
      "subject": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Anatomy",
        "code": "ANAT101"
      },
      "createdAt": "2024-01-10T08:00:00Z"
    }
  ]
}
```

**Errors:**
- `400`: Subject ID not provided
- `500`: Server error

---

### Create Chapter (Admin Only)
**Endpoint:** `POST /chapters`

**Headers:**
```
Authorization: Bearer [token]
```

**Request:**
```json
{
  "chapterNumber": 3,
  "title": "Muscular System",
  "description": "Study of muscles and their functions",
  "subject": "507f1f77bcf86cd799439011"
}
```

**Response (201):**
```json
{
  "message": "Chapter created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439022",
    "chapterNumber": 3,
    "title": "Muscular System",
    "description": "Study of muscles and their functions",
    "subject": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Anatomy",
      "code": "ANAT101"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `400`: Missing required fields
- `500`: Server error

---

## Notes Endpoints

### Get Notes (with filtering)
**Endpoint:** `GET /notes`

**Query Parameters:**
- `year` (optional): 1, 2, 3, or 4
- `subject` (optional): Subject ObjectId
- `chapter` (optional): Chapter ObjectId

**Examples:**
```
GET /notes
GET /notes?year=1
GET /notes?year=1&subject=507f1f77bcf86cd799439011
GET /notes?year=1&subject=507f1f77bcf86cd799439011&chapter=507f1f77bcf86cd799439020
```

**Response (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "title": "Anatomy Introduction Notes",
      "description": "Comprehensive introduction to human anatomy",
      "subject": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Anatomy",
        "code": "ANAT101"
      },
      "chapter": {
        "_id": "507f1f77bcf86cd799439020",
        "chapterNumber": 1,
        "title": "Introduction to Anatomy"
      },
      "year": 1,
      "pdfFileName": "1705315200000_abc123_notes.pdf",
      "pdfSize": 2097152,
      "uploadedBy": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "views": 45,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Errors:**
- `500`: Server error

---

### Create Note (Admin Only)
**Endpoint:** `POST /notes`

**Headers:**
```
Authorization: Bearer [token]
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Chapter 1 Notes",
  "description": "Comprehensive notes for chapter 1",
  "subject": "507f1f77bcf86cd799439011",
  "chapter": "507f1f77bcf86cd799439020",
  "year": 1,
  "pdfFileName": "1705315200000_abc123_notes.pdf",
  "pdfSize": 2097152,
  "uploadedBy": "507f1f77bcf86cd799439011"
}
```

**Response (201):**
```json
{
  "message": "Note created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "title": "Chapter 1 Notes",
    "description": "Comprehensive notes for chapter 1",
    "subject": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Anatomy",
      "code": "ANAT101"
    },
    "chapter": {
      "_id": "507f1f77bcf86cd799439020",
      "chapterNumber": 1,
      "title": "Introduction to Anatomy"
    },
    "year": 1,
    "pdfFileName": "1705315200000_abc123_notes.pdf",
    "pdfSize": 2097152,
    "uploadedBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "views": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `400`: Missing required fields
- `500`: Server error

---

## File Upload Endpoints

### Upload PDF File
**Endpoint:** `POST /upload`

**Headers:**
```
Content-Type: multipart/form-data
```

**Request:** FormData with file field

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/notes.pdf"
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('file', pdfFile);

fetch('/api/upload', {
  method: 'POST',
  body: formData
}).then(res => res.json());
```

**Response (200):**
```json
{
  "message": "File uploaded successfully",
  "filename": "1705315200000_abc123_notes.pdf",
  "size": 2097152,
  "type": "application/pdf",
  "originalName": "notes.pdf"
}
```

**Validation:**
- File type: PDF only
- Max size: 50MB
- Required: file field in FormData

**Errors:**
- `400`: No file provided or invalid file type
- `400`: File exceeds 50MB limit
- `500`: Server error

---

## PDF Blob Endpoint

### Get PDF as Blob (Stream)
**Endpoint:** `GET /pdf/[filename]`

**Parameters:**
- `filename` (path): Uploaded PDF filename

**Example:**
```
GET /api/pdf/1705315200000_abc123_notes.pdf
```

**Response (200):**
- Content-Type: application/pdf
- Content-Disposition: inline (view in browser)
- Binary PDF stream

**Headers:**
```
Content-Type: application/pdf
Content-Length: 2097152
Cache-Control: public, max-age=3600
Content-Disposition: inline
```

**Security:**
- Prevents directory traversal attacks
- Validates filename format
- Only serves from /public/uploads directory

**Errors:**
- `400`: Invalid filename
- `404`: PDF not found
- `500`: Server error

---

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## Error Response Format

All errors follow this format:

```json
{
  "message": "Error description",
  "error": "Detailed error message (optional)"
}
```

---

## Rate Limiting

Currently not implemented. For production:
- Implement IP-based rate limiting
- Use packages like `express-rate-limit`
- Add to middleware.js

---

## CORS Configuration

Currently accepts requests from same origin. For production:
- Add CORS headers for specific domains
- Use `next-cors` package
- Configure in route handlers

---

## Example Workflows

### User Viewing Notes

1. **Get subjects for year**
   ```
   GET /subjects/1
   ```

2. **Get chapters for subject**
   ```
   GET /chapters?subject=[subjectId]
   ```

3. **Get notes for subject**
   ```
   GET /notes?year=1&subject=[subjectId]
   ```

4. **Stream PDF**
   ```
   GET /pdf/[filename]
   ```

### Admin Creating Note

1. **Login**
   ```
   POST /auth/login
   ```

2. **Upload PDF**
   ```
   POST /upload
   ```

3. **Create note record**
   ```
   POST /notes
   ```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Get Subjects
```bash
curl http://localhost:3000/api/subjects/1
```

### Get Notes
```bash
curl "http://localhost:3000/api/notes?year=1&subject=<subjectId>"
```

### Upload PDF
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@notes.pdf"
```

---

## Testing with Postman

1. Import collection from examples
2. Set base URL: `http://localhost:3000/api`
3. Set environment variables for IDs
4. Test each endpoint sequentially

---

## WebSocket (Future Feature)

Real-time features planned:
- Live upload progress
- Notification system
- Collaborative editing

---

## API Versioning

Current version: v1 (implicit)

Future versions can be implemented with:
- `/api/v1/` prefix
- Accept header versioning
- Query parameter versioning

---

**Last Updated:** January 2024
**API Version:** 1.0
**Status:** Active
