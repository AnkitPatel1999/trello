# API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication

### Send OTP
```http
POST /auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "user",
      "isVerified": true,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <jwt_token>
```

## Projects

### Create Project
```http
POST /projects
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "project_id",
    "name": "My Project",
    "description": "Project description",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "isActive": true
  }
}
```

### Get All Projects
```http
GET /projects
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": "project_id",
      "name": "My Project",
      "description": "Project description",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "isActive": true
    }
  ]
}
```

### Get Project by ID
```http
GET /projects/:id
Authorization: Bearer <jwt_token>
```

### Update Project
```http
PUT /projects/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer <jwt_token>
```

## Tasks

### Create Task
```http
POST /tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description",
  "subtitles": ["Subtask 1", "Subtask 2"],
  "status": "todo",
  "projectId": "project_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "task_id",
    "title": "Task Title",
    "description": "Task description",
    "subtitles": ["Subtask 1", "Subtask 2"],
    "status": "todo",
    "projectId": "project_id",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get All Tasks
```http
GET /tasks?projectId=project_id&status=todo
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `projectId` (optional): Filter by project ID
- `status` (optional): Filter by status (proposed, todo, inprogress, done, deployed)

### Get Tasks by Project
```http
GET /tasks/project/:projectId
Authorization: Bearer <jwt_token>
```

### Get Task by ID
```http
GET /tasks/:id
Authorization: Bearer <jwt_token>
```

### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Task Title",
  "status": "inprogress",
  "subtitles": ["Updated Subtask 1", "New Subtask 2"]
}
```

### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <jwt_token>
```

## Task Status Values
- `proposed` - Task is proposed but not started
- `todo` - Task is ready to be worked on
- `inprogress` - Task is currently being worked on
- `done` - Task is completed
- `deployed` - Task is deployed/live

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error
