# Product Module

Complete e-commerce product management system with CRUD operations, search, filtering, and pagination.

## Features

- ✅ Product CRUD operations
- ✅ Advanced search and filtering
- ✅ Pagination support
- ✅ Category-based organization
- ✅ Price range filtering
- ✅ Stock management
- ✅ Image gallery support
- ✅ User ownership tracking
- ✅ Input validation with Zod
- ✅ Rate limiting
- ✅ Error handling with custom ApiError
- ✅ TypeScript support

## API Endpoints

### GET /products
List products with filtering and pagination (Public)
- **Query Params**: 
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10, max: 100)
  - `category` - Filter by category
  - `minPrice` - Minimum price filter
  - `maxPrice` - Maximum price filter
  - `search` - Text search in name/description
  - `sortBy` - Sort field (name, price, createdAt, stock)
  - `sortOrder` - Sort direction (asc, desc)

### GET /products/search
Search products by text (Public)
- **Query Params**: 
  - `q` - Search term (required)
  - `page` - Page number
  - `limit` - Items per page

### POST /products
Create a new product (Authenticated users)
- **Auth Required**: Yes
- **Body**: `{ name, description, price, stock, category, images? }`

### GET /products/:id
Get product by ID (Public)
- **Params**: `id` (MongoDB ObjectId)

### PATCH /products/:id
Update product (Authenticated users, owner only recommended)
- **Auth Required**: Yes
- **Params**: `id` (MongoDB ObjectId)
- **Body**: `{ name?, description?, price?, stock?, category?, images? }`

### DELETE /products/:id
Delete product (Authenticated users, owner only recommended)
- **Auth Required**: Yes
- **Params**: `id` (MongoDB ObjectId)

## Product Categories

- `electronics` - Electronic devices and gadgets
- `clothing` - Apparel and fashion items
- `books` - Books and publications
- `home` - Home and garden items
- `sports` - Sports and fitness equipment
- `beauty` - Beauty and personal care
- `toys` - Toys and games
- `other` - Miscellaneous items

## Data Model

```typescript
interface Product {
  _id: string;
  name: string;           // 2-100 characters
  description: string;    // 10-1000 characters
  price: number;          // >= 0
  stock: number;          // >= 0 (integer)
  category: string;       // One of predefined categories
  images: string[];       // Array of image URLs (max 10)
  createdBy: string;      // User ID who created the product
  createdAt: Date;
  updatedAt: Date;
}
```

## Integration Example

```typescript
// In your main app.ts or server.ts
import express from 'express';
import { productRoutes } from './modules/product';
import { ErrorHandler } from './middlewares/errorHandler';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Error handling (must be last)
app.use(ErrorHandler);

export default app;
```

## Usage Examples

### Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 199.99,
    "stock": 50,
    "category": "electronics",
    "images": ["https://example.com/image1.jpg"]
  }'
```

### List Products with Filters
```bash
curl "http://localhost:3000/api/products?category=electronics&minPrice=100&maxPrice=500&page=1&limit=10&sortBy=price&sortOrder=asc"
```

### Search Products
```bash
curl "http://localhost:3000/api/products/search?q=wireless&page=1&limit=10"
```

### Get Product by ID
```bash
curl http://localhost:3000/api/products/PRODUCT_ID
```

### Update Product
```bash
curl -X PATCH http://localhost:3000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "price": 179.99,
    "stock": 45
  }'
```

## Validation Rules

### Create Product
- **name**: 2-100 characters, required
- **description**: 10-1000 characters, required
- **price**: Non-negative number, required
- **stock**: Non-negative integer, required
- **category**: Must be one of predefined categories, required
- **images**: Array of valid URLs, max 10 items, optional

### Update Product
- All fields optional
- Same validation rules as create when provided

## Search & Filtering

### Text Search
- Searches in product name, description, and category
- Case-insensitive
- Supports partial matches

### Filtering Options
- **Category**: Exact match filter
- **Price Range**: Min/max price filtering
- **User Products**: Filter by creator (via createdBy)

### Sorting Options
- **name**: Alphabetical sorting
- **price**: Price-based sorting
- **createdAt**: Date-based sorting (newest/oldest)
- **stock**: Stock quantity sorting

## Performance Features

- **Database Indexes**: Optimized queries for search and filtering
- **Text Indexing**: Full-text search on name and description
- **Pagination**: Efficient data loading
- **Population**: User data populated in responses
- **Aggregation**: Complex queries using MongoDB aggregation pipeline

## Security Features

- **Authentication**: Required for create, update, delete operations
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive validation with Zod
- **Error Handling**: Secure error responses
- **Data Sanitization**: Automatic data cleaning and validation

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Product data or paginated results
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description"
}
```

## Future Enhancements

- Product reviews and ratings
- Inventory tracking and alerts
- Bulk operations
- Product variants (size, color, etc.)
- Advanced search with filters
- Product recommendations
- Image upload functionality
- SEO-friendly URLs with slugs