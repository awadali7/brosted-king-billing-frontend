# API Integration Guide

## Authentication

### Login Endpoint

**URL:** `POST /api/auth/login/`

**Request Body:**
```json
{
    "login": "awadali",
    "password": "12345678"
}
```

**Success Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 7,
            "username": "awadali",
            "email": "mailtoawad@gmail.com",
            "full_name": "Awad Ali",
            "role": "admin",
            "is_active": true
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires_in": "7d"
    }
}
```

### Token Storage

The frontend stores:
- `token` - JWT authentication token
- `user` - User object as JSON string

### Authorization Header

All authenticated requests include:
```
Authorization: Bearer <token>
```

## Frontend Usage

### Login
```typescript
import { api, ApiError } from '@/utils/api';

const response = await api.post("/auth/login/", {
    login: "username",
    password: "password"
});

if (response.success && response.data) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
}
```

### Making Authenticated Requests
```typescript
// The API utility automatically adds the Bearer token
const categories = await api.get('/categories/');
const newItem = await api.post('/menu-items/', { name: 'Pizza', price: '12.99' });
```

### Logout
```typescript
import { api } from '@/utils/api';

api.logout(); // Clears token and user data, redirects to login
```

## API Response Structure

Based on your backend, all responses follow this structure:

```typescript
{
    success: boolean;
    message?: string;
    data?: any;
    error?: any;
}
```

## Error Handling

```typescript
try {
    const data = await api.get('/endpoint/');
} catch (error) {
    if (error instanceof ApiError) {
        console.error('Status:', error.status);
        console.error('Message:', error.data.message);
    }
}
```

## Available API Methods

- `api.get(endpoint, params?)` - GET request
- `api.post(endpoint, data?)` - POST request  
- `api.put(endpoint, data)` - PUT request (full update)
- `api.patch(endpoint, data)` - PATCH request (partial update)
- `api.delete(endpoint)` - DELETE request
- `api.upload(endpoint, formData)` - File upload
- `api.logout()` - Logout and clear auth data

## Configuration

Set your API base URL in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

The API utility defaults to `http://localhost:8000/api` if not set.

