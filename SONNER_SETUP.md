# Sonner Toast Setup

## Installation Required

To use the toast notifications in this application, you need to install Sonner:

```bash
npm install sonner
```

or

```bash
yarn add sonner
```

or

```bash
pnpm add sonner
```

## What's Already Configured

The following files have been updated to integrate Sonner toast notifications:

1. **`src/app/layout.tsx`** - Added `<Toaster />` component with configuration
2. **`src/app/(main)/pos/page.tsx`** - Updated bill creation to use toast notifications instead of alerts

## Features

- ✅ Success toast when bill is created successfully
- ✅ Error toast when bill creation fails
- ✅ Displays API error messages (e.g., "Customer name is required")
- ✅ Toast position: top-right
- ✅ Rich colors for better UX
- ✅ Close button on each toast
- ✅ Auto-expand for long messages

## Usage in Other Parts of the App

You can use Sonner toast in any client component:

```typescript
import { toast } from "sonner";

// Success message
toast.success("Operation completed successfully");

// Error message
toast.error("Something went wrong");

// Info message
toast.info("Here's some information");

// Warning message
toast.warning("Please be careful");

// Loading toast
toast.loading("Processing...");

// Promise toast (shows loading, then success/error)
toast.promise(myAsyncFunction(), {
  loading: 'Loading...',
  success: 'Data loaded successfully',
  error: 'Failed to load data',
});
```

## API Response Handling

The app now handles API responses with the following structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Bill created successfully",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Customer name is required"
}
```

Both cases will display appropriate toast notifications to the user.

