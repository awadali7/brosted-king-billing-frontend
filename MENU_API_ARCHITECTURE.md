# Menu API Architecture

## Overview
This document describes the API architecture for the restaurant menu management system.

## API Endpoint

### GET `/api/menu`

Fetches menu items with optional filtering and search capabilities.

**Base URL**: `http://localhost:3000/api/menu`

**Method**: `GET`

**Query Parameters**:
- `category_id` (optional, number): Filter items by category ID
- `search` (optional, string): Search term to filter items by name/description

**Example Request**:
```bash
curl -X 'GET' \
  'http://localhost:3000/api/menu?category_id=2&search=b' \
  -H 'accept: */*'
```

## Response Structure

### Success Response

**Status Code**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "Menu retrieved successfully",
  "data": {
    "categories": [
      {
        "category_id": 2,
        "category_name": "Breads & Naan",
        "items": [
          {
            "id": 5,
            "name": "Biryani",
            "description": "Fragrant rice with chicken",
            "price": 280,
            "image_url": null
          }
        ]
      }
    ],
    "total_items": 3
  }
}
```

### Data Types

```typescript
interface MenuResponse {
  success: boolean;
  message: string;
  data: {
    categories: MenuCategory[];
    total_items: number;
  };
}

interface MenuCategory {
  category_id: number;
  category_name: string;
  items: MenuItem[];
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
}
```

## Frontend Implementation

### API Service

Located in `src/utils/api.ts`:

```typescript
// Menu API methods
menu: {
  async getMenu(category_id?: number, search?: string) {
    const params: Record<string, any> = {};
    if (category_id !== undefined) {
      params.category_id = category_id;
    }
    if (search) {
      params.search = search;
    }
    return api.get("/menu", params);
  },
}
```

### Usage Example

```typescript
import { api } from "@/utils/api";

// Fetch all menu items
const allMenu = await api.menu.getMenu();

// Fetch menu items by category
const categoryMenu = await api.menu.getMenu(2);

// Search menu items
const searchResults = await api.menu.getMenu(undefined, "biryani");

// Combined filtering
const filteredMenu = await api.menu.getMenu(2, "biryani");
```

## Design System Integration

The menu page follows the design system defined in `design-system.json`:

### Colors
- Primary: `#FF6B2C` (Orange)
- Secondary: `#2DD4BF` (Teal)
- Background: `#F9FAFB` (Light) / `#0F0F0F` (Dark)
- Text: `#111827` (Light) / `#FAFAFA` (Dark)

### Typography
- Font Family: Inter, system fonts
- Headings: 3xl, 2xl, xl
- Body: base, sm

### Spacing
- Padding: 1.5rem (card padding)
- Gap: 1.5rem (grid gap)
- Border Radius: 1rem (card), 0.5rem (button)

### Components
- Product Cards: Grid layout with image, title, description, price
- Search Input: Full width with icon
- Category Filters: Button group with active state
- Loading State: Spinner animation
- Error State: Red alert box

## Features

### 1. Search Functionality
- Real-time search as user types
- Searches through item names and descriptions
- Debouncing handled by API calls

### 2. Category Filtering
- Filter by specific category
- "All" option to show all items
- Dynamic category buttons from API response

### 3. Responsive Grid Layout
- 1 column on mobile
- 2 columns on tablet (sm)
- 3 columns on desktop (lg)
- 4 columns on large screens (xl)

### 4. Loading & Error States
- Loading spinner during API calls
- Error message display
- Empty state when no items found

### 5. Dark Mode Support
- All components support dark mode
- Colors adjusted for dark theme
- Smooth transitions between themes

## File Structure

```
src/
├── app/
│   └── (main)/
│       └── menu/
│           └── page.tsx          # Menu page component
├── types/
│   └── menu.ts                   # TypeScript interfaces
└── utils/
    └── api.ts                    # API service with menu methods
```

## Best Practices

1. **Separation of Concerns**: API logic separated from UI components
2. **Type Safety**: Full TypeScript support with interfaces
3. **Error Handling**: Try-catch blocks with user-friendly error messages
4. **Loading States**: UI feedback during API calls
5. **Responsive Design**: Mobile-first approach
6. **Accessibility**: Semantic HTML and ARIA labels
7. **Performance**: Efficient re-renders with React hooks
8. **Design System**: Consistent styling across components

## Future Enhancements

1. Add to cart functionality
2. Menu item editing
3. Image upload for items
4. Category management
5. Price filtering
6. Sorting options
7. Pagination for large menus
8. Favorites/starred items
9. Nutritional information
10. Allergen warnings
