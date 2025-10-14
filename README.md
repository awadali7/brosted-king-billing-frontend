# Restaurant Billing System - Frontend

A modern, minimal restaurant billing and management system built with Next.js, React, and Tailwind CSS.

## Features

- 🔐 **Authentication** - Secure login with JWT tokens
- 📊 **Dashboard** - Overview of restaurant operations
- 🍽️ **Menu Management** - Manage categories, items, and combos
- 💰 **Billing System** - Quick and efficient billing
- 📈 **Reports** - Sales, expenses, and profit analytics
- 👥 **User Management** - Admin and staff role management

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to the login page.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/
│   │   └── login/         # Login page
│   ├── dashboard/         # Dashboard page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home (redirects to login)
├── utils/
│   ├── api.ts             # API utility with all HTTP methods
│   └── api.example.ts     # Usage examples
└── ...
```

## API Utility

The project includes a comprehensive API utility (`src/utils/api.ts`) for making HTTP requests:

### Available Methods

```typescript
import { api } from '@/utils/api';

// GET request
const data = await api.get('/categories/');
const dataWithParams = await api.get('/menu-items/', { category: 1 });

// POST request
const created = await api.post('/categories/', { name: 'Drinks' });

// PUT request (full update)
const updated = await api.put('/categories/1/', { name: 'Beverages', description: 'All drinks' });

// PATCH request (partial update)
const patched = await api.patch('/menu-items/1/', { price: '15.99' });

// DELETE request
await api.delete('/categories/1/');

// File upload
const formData = new FormData();
formData.append('image', file);
const uploaded = await api.upload('/menu-items/upload/', formData);

// Token refresh
await api.refreshToken();
```

### Error Handling

```typescript
import { api, ApiError } from '@/utils/api';

try {
  const data = await api.get('/categories/');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('Status:', error.status);
    console.error('Data:', error.data);
  }
}
```

See `src/utils/api.example.ts` for more detailed usage examples.

## Authentication

The app uses JWT token authentication:

- Token is stored in `localStorage` as `token`
- User info is stored as `user` (JSON string)
- All API requests automatically include the Bearer token
- Login credentials: `{ login: "username", password: "password" }`

See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed API documentation.

## Design

- **UI Framework**: Tailwind CSS
- **Color Scheme**: Orange/Red gradient (restaurant theme)
- **Layout**: Responsive design (mobile & desktop)
- **Icons**: SVG icons included
- **Theme**: Modern, minimal, and clean

## Tech Stack

- **Framework**: Next.js 15.5
- **UI**: React 19.1
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **API Communication**: Fetch API with custom wrapper

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
