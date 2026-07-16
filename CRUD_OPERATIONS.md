# Complete CRUD Operations Documentation

## Overview

This document provides comprehensive documentation for all CRUD (Create, Read, Update, Delete) operations available in the Notes RX Admin System.

## Base URL
```
http://localhost:3000/api
```

---

## 1. SUBJECTS MANAGEMENT

### 1.1 Get All Subjects
**Endpoint:** `GET /subjects`

**Description:** Retrieve all subjects across all years

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Mathematics",
    "code": "MATH101",
    "year": 1,
    "department": "Engineering",
    "description": "Introduction to Mathematics",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### 1.2 Get Subjects by Year
**Endpoint:** `GET /subjects/{year}`

**Parameters:**
- `year` (path) - Academic year (1, 2, 3, or 4)

**Example:** `GET /subjects/1`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Mathematics",
    "code": "MATH101",
    "year": 1,
    "department": "Engineering",
    "description": "Introduction to Mathematics"
  }
]
```

### 1.3 Create Subject
**Endpoint:** `POST /subjects`

**Request Body:**
```json
{
  "name": "Physics",
  "code": "PHY101",
  "year": 1,
  "department": "Science",
  "description": "Introduction to Physics"
}
```

**Required Fields:** name, code, year, department

**Response (201):**
```json
{
  "message": "Subject created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Physics",
    "code": "PHY101",
    "year": 1,
    "department": "Science",
    "description": "Introduction to Physics",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 1.4 Get Individual Subject
**Endpoint:** `GET /subjects/{id}`

**Parameters:**
- `id` (path) - Subject MongoDB ID

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Physics",
  "code": "PHY101",
  "year": 1,
  "department": "Science",
  "description": "Introduction to Physics"
}
```

### 1.5 Update Subject
**Endpoint:** `PUT /subjects/{id}`

**Request Body:**
```json
{
  "name": "Physics Updated",
  "code": "PHY101",
  "year": 1,
  "department": "Science",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "message": "Subject updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Physics Updated",
    "code": "PHY101",
    "year": 1,
    "department": "Science",
    "description": "Updated description",
    "updatedAt": "2024-01-15T11:30:00Z"
  }
}
```

### 1.6 Delete Subject
**Endpoint:** `DELETE /subjects/{id}`

**Response (200):**
```json
{
  "message": "Subject deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Physics",
    "code": "PHY101"
  }
}
```

---

## 2. CHAPTERS MANAGEMENT

### 2.1 Get Chapters by Subject
**Endpoint:** `GET /chapters?subject={subjectId}`

**Parameters:**
- `subject` (query) - Subject MongoDB ID

**Response:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "chapterNumber": 1,
      "title": "Basic Concepts",
      "subject": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Physics"
      },
      "description": "Introduction to basic physics concepts",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2.2 Create Chapter
**Endpoint:** `POST /chapters`

**Request Body:**
```json
{
  "chapterNumber": 1,
  "title": "Basic Concepts",
  "subject": "507f1f77bcf86cd799439011",
  "description": "Introduction to basic physics concepts"
}
```

**Required Fields:** chapterNumber, title, subject

**Response (201):**
```json
{
  "message": "Chapter created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "chapterNumber": 1,
    "title": "Basic Concepts",
    "subject": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Physics"
    },
    "description": "Introduction to basic physics concepts"
  }
}
```

### 2.3 Get Individual Chapter
**Endpoint:** `GET /chapters/{id}`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "chapterNumber": 1,
  "title": "Basic Concepts",
  "subject": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Physics"
  },
  "description": "Introduction to basic physics concepts"
}
```

### 2.4 Update Chapter
**Endpoint:** `PUT /chapters/{id}`

**Request Body:**
```json
{
  "chapterNumber": 1,
  "title": "Advanced Concepts",
  "subject": "507f1f77bcf86cd799439011",
  "description": "Advanced physics concepts"
}
```

**Response (200):**
```json
{
  "message": "Chapter updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "chapterNumber": 1,
    "title": "Advanced Concepts",
    "subject": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Physics"
    }
  }
}
```

### 2.5 Delete Chapter
**Endpoint:** `DELETE /chapters/{id}`

**Response (200):**
```json
{
  "message": "Chapter deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "chapterNumber": 1,
    "title": "Basic Concepts"
  }
}
```

---

## 3. NOTES MANAGEMENT

### 3.1 Get Notes with Filters
**Endpoint:** `GET /notes?year={year}&subject={subjectId}&chapter={chapterId}`

**Parameters (all optional):**
- `year` (query) - Filter by year (1-4)
- `subject` (query) - Filter by subject ID
- `chapter` (query) - Filter by chapter ID

**Example:** `GET /notes?year=1&subject=507f1f77bcf86cd799439011`

**Response:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Physics Notes - Chapter 1",
      "description": "Detailed notes on basic concepts",
      "subject": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Physics"
      },
      "chapter": {
        "_id": "507f1f77bcf86cd799439012",
        "chapterNumber": 1,
        "title": "Basic Concepts"
      },
      "year": 1,
      "views": 150,
      "pdfFileName": "physics_ch1_20240115.pdf",
      "pdfSize": 2048576,
      "uploadedBy": {
        "_id": "507f1f77bcf86cd799439001",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3.2 Create Note
**Endpoint:** `POST /notes`

**Request Body:**
```json
{
  "title": "Physics Notes - Chapter 1",
  "description": "Detailed notes on basic concepts",
  "subject": "507f1f77bcf86cd799439011",
  "chapter": "507f1f77bcf86cd799439012",
  "year": 1,
  "pdfFileName": "physics_ch1_20240115.pdf",
  "pdfSize": 2048576,
  "uploadedBy": "507f1f77bcf86cd799439001"
}
```

**Required Fields:** title, subject, chapter, year, pdfFileName, uploadedBy

**Response (201):**
```json
{
  "message": "Note created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Physics Notes - Chapter 1",
    "subject": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Physics"
    },
    "chapter": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Basic Concepts"
    },
    "year": 1,
    "views": 0,
    "pdfFileName": "physics_ch1_20240115.pdf",
    "pdfSize": 2048576,
    "uploadedBy": {
      "_id": "507f1f77bcf86cd799439001",
      "name": "Admin User"
    }
  }
}
```

### 3.3 Get Individual Note
**Endpoint:** `GET /notes/{id}`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "Physics Notes - Chapter 1",
  "subject": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Physics"
  },
  "chapter": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Basic Concepts"
  },
  "year": 1,
  "views": 150,
  "pdfFileName": "physics_ch1_20240115.pdf"
}
```

### 3.4 Update Note
**Endpoint:** `PUT /notes/{id}`

**Request Body:**
```json
{
  "title": "Physics Notes - Chapter 1 Updated",
  "description": "Updated detailed notes",
  "subject": "507f1f77bcf86cd799439011",
  "chapter": "507f1f77bcf86cd799439012",
  "year": 1,
  "pdfFileName": "physics_ch1_updated.pdf",
  "pdfSize": 2097152
}
```

**Response (200):**
```json
{
  "message": "Note updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Physics Notes - Chapter 1 Updated",
    "subject": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Physics"
    }
  }
}
```

### 3.5 Delete Note
**Endpoint:** `DELETE /notes/{id}`

**Response (200):**
```json
{
  "message": "Note deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Physics Notes - Chapter 1"
  }
}
```

---

## 4. ADMIN USERS MANAGEMENT

### 4.1 Get All Admin Users
**Endpoint:** `GET /admin/users`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439001",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "department": "Engineering",
    "isActive": true,
    "createdAt": "2024-01-10T10:00:00Z"
  }
]
```

### 4.2 Create Admin User
**Endpoint:** `POST /admin/users`

**Request Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "securePassword123",
  "role": "admin",
  "department": "Science"
}
```

**Required Fields:** name, email, password

**Response (201):**
```json
{
  "message": "Admin user created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439002",
    "name": "New Admin",
    "email": "newadmin@example.com",
    "role": "admin",
    "department": "Science",
    "isActive": true
  }
}
```

### 4.3 Get Individual Admin User
**Endpoint:** `GET /admin/users/{id}`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439001",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "department": "Engineering",
  "isActive": true,
  "createdAt": "2024-01-10T10:00:00Z"
}
```

### 4.4 Update Admin User
**Endpoint:** `PUT /admin/users/{id}`

**Request Body:**
```json
{
  "name": "Updated Admin",
  "email": "admin@example.com",
  "role": "superadmin",
  "department": "Engineering",
  "isActive": true
}
```

**Response (200):**
```json
{
  "message": "Admin user updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439001",
    "name": "Updated Admin",
    "email": "admin@example.com",
    "role": "superadmin"
  }
}
```

### 4.5 Delete Admin User
**Endpoint:** `DELETE /admin/users/{id}`

**Response (200):**
```json
{
  "message": "Admin user deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439001",
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### 4.6 Change Password
**Endpoint:** `POST /admin/change-password`

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439001",
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

## 5. ADVANCED OPERATIONS

### 5.1 Get Dashboard Statistics
**Endpoint:** `GET /admin/statistics`

**Response:**
```json
{
  "overview": {
    "totalSubjects": 15,
    "totalChapters": 45,
    "totalNotes": 120,
    "totalAdmins": 3,
    "notesThisMonth": 25,
    "totalViews": 5230
  },
  "subjectsByYear": [
    {
      "_id": 1,
      "count": 5
    },
    {
      "_id": 2,
      "count": 4
    }
  ],
  "topSubjects": [
    {
      "subjectName": "Mathematics",
      "count": 35
    },
    {
      "subjectName": "Physics",
      "count": 28
    }
  ],
  "recentNotes": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Physics Notes - Chapter 1",
      "subject": {
        "name": "Physics"
      },
      "uploadedBy": {
        "name": "Admin User"
      },
      "views": 150,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 5.2 Search Resources
**Endpoint:** `GET /search?q={query}&type={type}`

**Parameters:**
- `q` (query) - Search query (minimum 2 characters)
- `type` (query) - Resource type (subjects, chapters, notes, or empty for all)

**Example:** `GET /search?q=physics&type=subjects`

**Response:**
```json
{
  "message": "Search completed",
  "data": {
    "subjects": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Physics",
        "code": "PHY101"
      }
    ],
    "chapters": [],
    "notes": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Physics Notes - Chapter 1",
        "subject": {
          "name": "Physics"
        }
      }
    ]
  }
}
```

### 5.3 Bulk Delete
**Endpoint:** `POST /admin/bulk-delete`

**Request Body:**
```json
{
  "ids": ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"],
  "resourceType": "notes"
}
```

**Response (200):**
```json
{
  "message": "Successfully deleted 2 notes",
  "data": {
    "deletedCount": 2
  }
}
```

### 5.4 Export Data
**Endpoint:** `GET /admin/export?type={type}&format={format}`

**Parameters:**
- `type` (query) - Resource type (subjects, chapters, notes)
- `format` (query) - Export format (json or csv)

**Example:** `GET /admin/export?type=notes&format=csv`

**Response:** CSV file download with headers and data rows

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request (invalid parameters)
- **404** - Not Found
- **409** - Conflict (duplicate entry)
- **500** - Server Error

Error Response Format:
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Best Practices

1. **Always validate input** - Check required fields before submitting
2. **Use proper error handling** - Implement try-catch in your client
3. **Implement pagination** - For large datasets, add limit and offset parameters
4. **Cache responses** - Use browser or application caching for frequently accessed data
5. **Batch operations** - Use bulk-delete for deleting multiple items
6. **Export regularly** - Export data for backup purposes

---

## Rate Limiting

Currently, there is no rate limiting implemented. It is recommended to add rate limiting in production environments.

---

## Security Considerations

1. All passwords are hashed using SHA256
2. Only admins can access admin endpoints
3. Passwords are never returned in API responses
4. Use HTTPS in production
5. Implement JWT tokens for stateless authentication
6. Add CORS policies as needed

