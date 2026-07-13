# Tech Setup Guide: Neon + Next.js + Clerk

**Stack:**
- Next.js 16.2.10 LTS
- Neon (PostgreSQL)
- Clerk (Authentication for Phase 2)
- Cloudinary (Image storage)
- Vercel (Hosting)
- TailwindCSS (Styling)

---

## Part 1: Local Environment Setup

### 1.1 Prerequisites
```bash
# Check Node version (need 18+)
node --version

# Check npm version
npm --version
```

### 1.2 Create Next.js Project
```bash
# Create new Next.js project
npx create-next-app@latest selling-preloved --typescript --tailwind

# Navigate to project
cd selling-preloved

# Choose options:
# ✅ TypeScript: Yes
# ✅ ESLint: Yes
# ✅ Tailwind CSS: Yes
# ✅ App Router: Yes (default)
# ✅ Src/ directory: No
# ✅ Import alias: Yes (@/* for imports)
```

### 1.3 Install Dependencies
```bash
npm install

# Neon client
npm install @neondatabase/serverless

# Image optimization
npm install next-image-export-optimizer

# Environment management
npm install dotenv

# Optional: Database migrations (Phase 2)
# npm install drizzle-orm drizzle-kit
```

---

## Part 2: Neon Setup

### 2.1 Create Neon Account & Database
1. Go to [neon.tech](https://neon.tech)
2. Sign up (free tier)
3. Create new project: `selling-preloved`
4. Select region closest to your users (e.g., India: Singapore)
5. Note your **Connection String** (looks like: `postgresql://user:password@...`)

### 2.2 Environment Variables
Create `.env.local` in root:
```env
# Neon Database
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/selling-preloved?sslmode=require

# Admin auth — Clerk (gates /admin + mutating APIs; see Part 7)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Clerk (Phase 2 only - fill in when adding multi-seller)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
# CLERK_SECRET_KEY=your_secret_here

# WhatsApp Business API (Phase 2)
# WHATSAPP_BUSINESS_PHONE_ID=your_phone_id
# WHATSAPP_BUSINESS_TOKEN=your_token
```

**Important:** Add `.env.local` to `.gitignore`
```
# .gitignore
.env.local
.env.*.local
```

### 2.3 Test Connection
Create `lib/db.ts`:
```typescript
import { sql } from '@neondatabase/serverless';

export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Connected to Neon:', result);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}
```

Run in API route or server action to verify.

---

## Part 3: Database Schema

### 3.1 Create Tables with Neon Console
Go to Neon Dashboard → SQL Editor → Run this:

```sql
-- Items table
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  condition VARCHAR(20), -- new, like-new, good, fair
  seller_id VARCHAR(255), -- clerk user_id for Phase 2
  is_sold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Item images (Cloudinary URLs)
CREATE TABLE item_images (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlists (Phase 1: client-side only via localStorage)
-- (Keep for reference, implement Phase 2 when adding auth)
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255), -- clerk user_id
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id)
);

-- Create indexes for performance
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_condition ON items(condition);
CREATE INDEX idx_items_price ON items(price);
CREATE INDEX idx_items_created_at ON items(created_at DESC);
CREATE INDEX idx_item_images_item_id ON item_images(item_id);
```

### 3.2 Seed Initial Data (Optional)
```sql
INSERT INTO items (title, description, price, category, condition, seller_id) VALUES
('Vintage Black Blazer', 'Timeless wool blazer, perfect for layering. Worn twice.', 45.00, 'clothing', 'like-new', 'seller_akbar'),
('Leather Brown Belt', 'Italian leather, genuine vintage. Some patina adds character.', 25.00, 'accessories', 'good', 'seller_akbar');

-- Add images for items
INSERT INTO item_images (item_id, image_url, alt_text, display_order) VALUES
(1, 'https://res.cloudinary.com/your-cloud/image/upload/v1720xxx/blazer-1.jpg', 'Black blazer front view', 1),
(1, 'https://res.cloudinary.com/your-cloud/image/upload/v1720xxx/blazer-2.jpg', 'Black blazer back view', 2);
```

---

## Part 4: API Routes Setup

### 4.1 Query Items (GET `/api/items`)
Create `app/api/items/route.ts`:

```typescript
import { sql } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let query = 'SELECT * FROM items WHERE is_sold = FALSE';
    const params: any[] = [];

    if (category) {
      query += ' AND category = $' + (params.length + 1);
      params.push(category);
    }
    if (condition) {
      query += ' AND condition = $' + (params.length + 1);
      params.push(condition);
    }
    if (minPrice) {
      query += ' AND price >= $' + (params.length + 1);
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= $' + (params.length + 1);
      params.push(parseFloat(maxPrice));
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const result = await sql(query, params);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
```

### 4.2 Get Single Item (GET `/api/items/[id]`)
Create `app/api/items/[id]/route.ts`:

```typescript
import { sql } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await sql`
      SELECT i.*, json_agg(json_build_object(
        'id', img.id,
        'url', img.image_url,
        'alt', img.alt_text
      ) ORDER BY img.display_order) as images
      FROM items i
      LEFT JOIN item_images img ON i.id = img.item_id
      WHERE i.id = ${parseInt(params.id)}
      GROUP BY i.id
    `;

    if (item.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}
```

---

## Part 4.3: Admin Panel for Item Management (MVP)

> **Superseded (see Part 7):** the password gate below has been **replaced by Clerk
> auth**. `/admin` is now a server component that guards with `auth()` + the `admin`
> role, and the interactive body lives in `components/AdminDashboard.tsx`. The
> password-page sample here is kept only as historical context. There is no
> `NEXT_PUBLIC_ADMIN_PASSWORD` / `x-admin-password` anymore.

### Simple Password-Protected Admin Page (historical — replaced by Clerk)

Create `app/admin/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { ItemForm } from '@/components/ItemForm';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check against environment variable
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      // Store in sessionStorage (clears when browser closes)
      sessionStorage.setItem('adminAuthenticated', 'true');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  // Check if already authenticated
  if (typeof window !== 'undefined' && sessionStorage.getItem('adminAuthenticated') && !isAuthenticated) {
    setIsAuthenticated(true);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-serif text-gray-900 mb-8">Admin Access</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-gray-900">Manage Items</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem('adminAuthenticated');
              setIsAuthenticated(false);
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <ItemForm />
        </div>
      </div>
    </div>
  );
}
```

### Create ItemForm Component

Create `components/ItemForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ItemForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'clothing',
    condition: 'good',
    imageUrls: [''], // Array for multiple Cloudinary URLs
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newUrls = [...formData.imageUrls];
    newUrls[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: newUrls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          imageUrls: formData.imageUrls.filter(url => url.trim()), // Remove empty URLs
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create item');
      }

      setSuccess('Item created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'clothing',
        condition: 'good',
        imageUrls: [''],
      });

      // Refresh items list
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Vintage Black Blazer"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="45.00"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="home">Home & Décor</option>
            <option value="books">Books</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe the item, condition, wear notes, styling tips..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cloudinary Image URLs (paste from Cloudinary dashboard)
        </label>
        {formData.imageUrls.map((url, index) => (
          <input
            key={index}
            type="url"
            value={url}
            onChange={(e) => handleImageChange(index, e.target.value)}
            placeholder={`Image URL ${index + 1}`}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 mb-2"
          />
        ))}
        <button
          type="button"
          onClick={() => setFormData(prev => ({ 
            ...prev, 
            imageUrls: [...prev.imageUrls, ''] 
          }))}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          + Add another image
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create Item'}
      </button>
    </form>
  );
}
```

### Create POST API Route for Items

Create `app/api/items/route.ts`:

```typescript
import { sql } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, description, price, category, condition, imageUrls } = await req.json();

    // Insert item
    const itemResult = await sql`
      INSERT INTO items (title, description, price, category, condition, seller_id)
      VALUES (${title}, ${description}, ${price}, ${category}, ${condition}, 'seller_akbar')
      RETURNING id
    `;

    const itemId = itemResult.rows[0].id;

    // Insert images
    for (let i = 0; i < imageUrls.length; i++) {
      await sql`
        INSERT INTO item_images (item_id, image_url, display_order)
        VALUES (${itemId}, ${imageUrls[i]}, ${i + 1})
      `;
    }

    return NextResponse.json({ success: true, itemId }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
```

### Access Admin Panel

Visit `http://localhost:3000/admin`. You are redirected to Clerk sign-in; sign in as
the owner (the Clerk user with `publicMetadata.role = "admin"`) to reach the dashboard.
See Part 7 for the Clerk setup.

---

## Part 4.4: Edit, Delete & Sold Toggle

Extends the create-only admin panel so items can be **edited**, **deleted**, and
**marked sold/available** after creation.

### Auth on mutating endpoints

Create/edit/delete are destructive, so the API guards them with **Clerk** auth. The
server calls `isAdmin()` in `lib/adminAuth.ts` (`await currentUser()` →
`publicMetadata.role === "admin"`); not signed-in-as-admin → `401`. The browser sends
no auth header — Clerk's same-origin session cookie authenticates the fetch. Public
`GET` catalog endpoints stay open. See Part 7 for the full auth design.

### API surface

| Method + route            | Auth | Purpose                                                        |
|---------------------------|------|---------------------------------------------------------------|
| `GET /api/items`          | no   | Public catalog. `?includeSold=true` → admin view incl. sold   |
| `POST /api/items`         | yes  | Create an item                                                |
| `GET /api/items/[id]`     | no   | Single item                                                   |
| `PATCH /api/items/[id]`   | yes  | Full-replace editable fields + `isSold`; replaces image set   |
| `DELETE /api/items/[id]`  | yes  | Delete item (`item_images` removed via `ON DELETE CASCADE`)   |

- Payload validation for `POST` and `PATCH` is shared in `lib/validateItem.ts`
  (`parseItemInput`) — same rules (title/description required, price > 0, category/
  condition in the allowed unions).
- `PATCH` does a **full replace** of the image set: existing `item_images` rows are
  deleted and re-inserted from `imageUrls` in order.
- Cloudinary files are **not** deleted on item delete (orphaned but harmless).

### Data layer

`lib/data/items.{ts,mock,neon}.ts` gain `getAllItems` (catalog incl. sold),
`updateItem(id, input)`, and `deleteItem(id)`, exported through the same adapter swap
point as `getItems`/`createItem`. `UpdateItemInput` (`lib/types.ts`) = `CreateItemInput`
plus optional `isSold`.

### Admin UI

- `components/ItemForm.tsx` is now dual-mode: no `item` prop → create (`POST`);
  with an `item` prop → edit (`PATCH`), prefilled, with a **Mark as sold** checkbox and
  a Cancel action. Both modes rely on the Clerk session cookie (no auth header).
- `components/AdminItemList.tsx` (new) lists all items (`?includeSold=true`) with a
  thumbnail, price, an Available/Sold badge, and **Edit** (expands an inline `ItemForm`)
  + **Delete** (two-step inline confirm, no browser dialog) actions.
- `app/admin/page.tsx` renders `<AdminItemList />` below the create form.

---

## Part 5: Environment & Deployment

### 5.1 Local Development
```bash
# Start development server
npm run dev

# Visit http://localhost:3000
```

### 5.2 Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# - DATABASE_URL (copy from Neon)
# - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
# - CLERK keys (Phase 2)
```

### 5.3 Neon Branching (Development Database)
```bash
# Create a dev branch from main
neon branches create --project-id <project-id> --parent main

# Use dev branch connection string in local development
# Switch DATABASE_URL in .env.local to dev branch
```

---

## Part 6: Cloudinary Setup

### 6.1 Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free tier: 25GB/month)
3. Copy `CLOUD_NAME` from dashboard
4. Add to `.env.local`: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

### 6.2 Upload Images for Items
For MVP, manually upload images via Cloudinary dashboard:
1. Go to Media Library
2. Upload images
3. Copy Cloudinary URL from each image
4. Paste URLs into admin panel when creating items

---

## Part 7: Admin Auth with Clerk (implemented)

The `/admin` seller dashboard and every mutating API route are gated by **Clerk**.
This replaced the MVP `NEXT_PUBLIC_ADMIN_PASSWORD` / `x-admin-password` gate. It is
single-admin (one owner) — multi-seller onboarding remains a later phase.

### 7.1 Clerk dashboard prerequisites (manual)
1. Create an application at [clerk.com](https://clerk.com).
2. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` into `.env.local`
   (and the deploy env). Locally provisioned via the Vercel ↔ Clerk Marketplace
   integration in production.
3. On the owner's Clerk user, set **`publicMetadata.role = "admin"`** (Users → the
   user → Metadata → Public).
4. Disable public sign-ups (Configure → restrictions / sign-up) so strangers can't
   self-register. Even if they do, the role check below blocks all admin access.

### 7.2 Wiring
- `npm install @clerk/nextjs`.
- `app/layout.tsx` wraps the tree in `<ClerkProvider>`.
- `proxy.ts` (Next 16 renamed `middleware` → `proxy`) exports
  `export default clerkMiddleware()` with the standard matcher. It does **not**
  blanket-protect routes; authorization is enforced at each resource.
- `lib/adminAuth.ts` exposes `isAdmin()` — `await currentUser()` then
  `user?.publicMetadata?.role === "admin"`.

### 7.3 Enforcement
- **Page** (`app/admin/page.tsx`, server component): `const { userId, redirectToSignIn }
  = await auth()`. Signed-out → `redirectToSignIn()` (Clerk hosted sign-in); signed-in
  non-admin → `redirect("/")`. The interactive body lives in
  `components/AdminDashboard.tsx` (client), header uses Clerk `<UserButton>`.
- **API routes** — each returns `401` unless `await isAdmin()`:
  `POST /api/items`, `PATCH|DELETE /api/items/[id]`, `PATCH /api/items/reorder`,
  `GET /api/media`. Clients no longer send any auth header — Clerk's same-origin
  session cookie authenticates the fetch (`ItemForm`, `AdminItemList`, `MediaPicker`).

### 7.4 Later: multi-seller
Multi-seller onboarding (multiple admins, per-seller items) stays a future phase —
it builds on this Clerk foundation (add seller roles / ownership on items).

---

## Part 8: Product Ordering & Enhanced Image Upload

Lets the admin control the **catalog order** of products and the **order of an
item's images**, plus a refined drag-and-drop image uploader. Uses `@dnd-kit`
(`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`) for both drag surfaces.

### 8.1 Schema — `items.sort_order`

`item_images.display_order` already existed; items now get their own position:

```sql
ALTER TABLE items ADD COLUMN IF NOT EXISTS sort_order INTEGER;
-- Backfill existing rows newest-first (lower = shown earlier):
UPDATE items SET sort_order = sub.rn
  FROM (SELECT id, row_number() OVER (ORDER BY created_at DESC) AS rn FROM items) sub
  WHERE items.id = sub.id AND items.sort_order IS NULL;
CREATE INDEX IF NOT EXISTS idx_items_sort_order ON items (sort_order ASC);
```

`npm run db:setup` applies this idempotently (no reseed if rows exist).

### 8.2 Default sort → custom order

The default (non-price) sort in both adapters (`lib/data/items.neon.ts`,
`lib/data/items.mock.ts`) is now `sort_order ASC NULLS LAST, created_at DESC`.
The `price-asc` / `price-desc` filter options are unchanged and still override the
custom order. New items are inserted at the **top** (`MIN(sort_order) − 1`).

### 8.3 `PATCH /api/items/reorder`

- **Auth:** Clerk admin (`isAdmin()`, same as other mutating routes; see Part 7).
- **Body:** `{ "orderedIds": number[] }` — the full list of item ids in their new order; index 0 is shown first.
- **Effect:** `reorderItems()` sets each item's `sort_order` to its index + 1.
- **Response:** `{ "success": true }`, or `400` if `orderedIds` isn't an array of integers.

The admin list (`components/AdminItemList.tsx`) reorders optimistically and
**auto-saves on drop**; on failure it reloads to snap back to server truth.

### 8.4 Image ordering

No new endpoint. `components/ItemForm.tsx` holds an ordered `imageUrls` array; the
drag-to-reorder grid (`components/SortableImageGrid.tsx`) mutates that array, and
create/update already map array index → `item_images.display_order`. The first
image is the catalog cover.

---

## Part 9: Media Gallery Picker

Lets the admin reuse an image already uploaded to Cloudinary instead of always
uploading a fresh copy. A single **+ Add images** button in `ItemForm` opens the
`MediaPicker` modal (`components/MediaPicker.tsx`) with two tabs:

- **Gallery** — grid of images already in the Cloudinary folder; tap to select, then
  **Add N images**. Images already on the item are shown disabled ("Added").
- **Upload** — the existing direct-to-Cloudinary drag-drop / browse flow (moved out of
  `ItemForm`); newly uploaded URLs are added to the item immediately.

The picker hands URLs back via `onAdd`; `ItemForm.addUrls()` appends them and
**dedupes** against the current `imageUrls`. Ordering/cover/remove still come from
`SortableImageGrid` — no change to how images are stored (`item_images`).

### 9.1 `GET /api/media`

Create `app/api/media/route.ts`:

- **Auth:** Clerk admin (`isAdmin()`, same as mutating routes; see Part 7);
  `401` if missing. The Cloudinary **Admin** API needs the API secret, so this listing
  must be server-side and admin-gated.
- **Config:** reuses existing env — `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_FOLDER` (default
  `preloved`). Returns `501` when unconfigured (mirrors `/api/upload`).
- **Upstream:** `POST https://api.cloudinary.com/v1_1/{cloud}/resources/search` with
  `Authorization: Basic base64(apiKey:apiSecret)` and body
  `{ expression: "folder:{folder}", sort_by: [{ created_at: "desc" }], max_results: 100, next_cursor? }`.
  Newest-first ordering via the Search API.
- **Query:** optional `?cursor=` → passed as `next_cursor` for "Load more".
- **Response:** trimmed shape (no keys/secrets):
  `{ images: [{ url, publicId, width, height }], nextCursor: string | null }`.
  `502` if the upstream call fails.

| Method / route     | Auth | Purpose                                                        |
| ------------------ | ---- | ------------------------------------------------------------- |
| `GET /api/media`   | yes  | List Cloudinary folder images (newest-first, cursor paginated) |

---

## Part 13: Infinite Scroll Gallery

The public gallery loads in batches as the user scrolls instead of returning the whole
catalog in one query/DOM render.

### 13.1 Data layer — `limit` / `offset`

`ItemFilters` (`lib/types.ts`) gains optional `limit` and `offset`. `parseFilters`
(`lib/filters.ts`) parses them from query params (`limit` > 0, `offset` >= 0; otherwise
undefined), so `/api/items?...&limit=8&offset=8` works with **no change to the route**.

Both adapters apply them only when present (unpaginated callers — sitemap, item detail —
are unaffected):

- **Neon** (`lib/data/items.neon.ts`): a shared `buildWhere()` produces the WHERE clause +
  bound params; `queryItems` appends `LIMIT $n OFFSET $n`, and `countItems` runs
  `SELECT COUNT(*)` over the same clause. Exposed as `getItemCount(filters)`.
- **Mock** (`lib/data/items.mock.ts`): `paginate()` slices the filtered result; matching
  `getItemCount`.
- `lib/data/items.ts` re-exports `getItemCount` from the active adapter.

### 13.2 Request / response

`GET /api/items?category&condition&minPrice&maxPrice&q&sort&limit&offset` → JSON array of
at most `limit` items starting at `offset`, using the same filter/sort as before. An
`offset` past the end returns `[]`.

### 13.3 Rendering flow

- `app/page.tsx` (Server Component) fetches the **first batch** (`limit: 8, offset: 0`) and
  the total via `getItemCount` (drives the search-result header), then mounts
  `<ItemGrid key={query} initialItems query pageSize={8} initialHasMore={items.length === 8} />`.
  `key={query}` remounts the grid on any filter/sort change, resetting scroll state.
- `components/ItemGrid.tsx` (Client Component) seeds from `initialItems`, renders the
  two-column masonry, and observes a bottom sentinel with `IntersectionObserver`
  (`rootMargin: 600px`). On intersect it fetches the next batch at
  `offset = items.length`, appends, and sets `hasMore = batch.length === pageSize`.
  A ref guard prevents overlapping fetches; on fetch error it stops loading more.
  Skeleton cards (`.skeleton` shimmer) fill the column tails while a batch loads.

---

## Part 14: About Page & SEO

A static `/about` page that states the site's purpose and the seller's story, plus the
SEO wiring that supports it.

### 14.1 Route

`app/about/page.tsx` — a **Server Component** with no data fetch. Sections: hero, mission,
how-it-works (three `.glass` cards), seller intro (Akbar), CTA back to the gallery. Reuses
existing tokens only (`text-hero`/`text-h2`/`text-h3`, `.tracked`, `.glass`, `.veil`, `.rise`),
so no new design primitives. Aurora background is inherited from the root layout.

### 14.2 Metadata

`export const metadata: Metadata` provides:

- `title: "About"` → renders **"About | Selling Preloved Items"** via the root
  `title.template` (`app/layout.tsx`)
- `description` — the mission one-liner (shared with the JSON-LD via a `MISSION` constant)
- `alternates.canonical: "/about"`
- `openGraph` — `title`, `description`, `url: "/about"`, `type: "website"`

**Root layout fix:** `app/layout.tsx` `metadata` now sets
`metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")`
(same env var as `app/sitemap.ts`). Without it, relative Open Graph / canonical URLs do
not resolve to absolute URLs. This benefits **every** page, not just `/about`.

### 14.3 Structured data

Inline `<script type="application/ld+json">` (same pattern as the item page's `Product`
schema) with a `@graph` of two nodes:

- `AboutPage` — `name`, `description` (mission), `url`
- `Organization` — `name`, `description`, `url`, `founder` (Person "Akbar")

### 14.4 Discovery

- `app/sitemap.ts` — adds `{ url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.6 }`.
- `components/Navbar.tsx` (`NAV_LINKS`) and `components/Footer.tsx` — add an **About** link
  (renders in desktop nav, mobile menu, and footer).

---

## Part 15: Home Page & Gallery Route Split

Splits the old single-route storefront into a **home page** (`/`) and a **gallery**
(`/gallery`), so `/` can be a simple funnel while `/gallery` holds the full filter/search
grid. Adds a shared SEO module and a standing SEO rule.

### 15.1 Routes

- **`app/gallery/page.tsx`** — the previous root gallery, moved verbatim (async Server
  Component: server-renders the first batch of 8, then `ItemGrid` infinite-scrolls). Its
  hero is simplified to match the reference: tracked eyebrow + a single serif `<h1>`
  ("Preloved treasures."), the old descriptive paragraph removed. Adds a `metadata` export
  (`title: "Gallery"`, keyword description, `alternates.canonical: "/gallery"`, `openGraph`)
  and inline `CollectionPage` JSON-LD.
- **`app/page.tsx`** — the new **home**. Server Component that fetches the 6 newest items
  (`getItems({ limit: 6, offset: 0 })`) for a preview strip of `ItemCard`s under a minimal
  hero + cream **"Enter the gallery"** CTA. No FilterBar, no infinite scroll. `metadata`
  (description, canonical `/`, `openGraph`) + `@graph` JSON-LD of `WebSite` (with a
  `SearchAction` pointing at `/gallery?q=`) and `Organization`.

### 15.2 Link & search rewiring

Because the gallery is no longer at `/`, all gallery-bound navigation was repointed:

- `components/Navbar.tsx` — `NAV_LINKS` "Gallery" → `/gallery`; the logo still points at `/`.
  The search field now pushes to `/gallery?q=…` (search lands on the gallery from any page).
- `components/FilterBar.tsx` — uses `usePathname()` for its `router.push` target and the
  Clear link, so filters/sort stay on whatever route hosts the bar (`/gallery`).
- `components/Footer.tsx` — footer "Gallery" link → `/gallery`.
- `app/about/page.tsx` — CTA → `/gallery`.

### 15.3 Shared SEO module — `lib/seo.ts`

Single source for `SITE_NAME`, `SITE_URL` (reads `NEXT_PUBLIC_SITE_URL`), a `canonical(path)`
helper, and `websiteJsonLd` / `organizationJsonLd` builders. Consumed by `app/layout.tsx`
(`metadataBase`, default description), `app/page.tsx` (JSON-LD), `app/sitemap.ts`, and
`app/robots.ts` — replacing the base-URL literals those files each defined.

### 15.4 Discovery

- `app/sitemap.ts` — adds `/gallery` (`changeFrequency: "daily"`, `priority: 0.9`); all
  entries now use `canonical()`.
- `app/robots.ts` — unchanged rules (still disallows `/admin`, `/api/`); uses `canonical()`.

### 15.5 Standing SEO rule

`.claude/rules/seo.md` — codifies that every public page ships metadata + the right JSON-LD,
one keyword-bearing `<h1>`, image `alt`s, and that any route add/rename/remove updates
`sitemap.ts`/`robots.ts` in the same task, with absolute URLs sourced from `lib/seo.ts`.

---

## Part 16: Admin-Editable Site Content & SEO

Lets the admin edit marketing copy + per-page SEO from the studio, with code defaults as the
fallback so the site always renders.

### 16.1 Route-group refactor (admin chrome)

`/admin` no longer inherits the public navbar/newsletter/footer. Public routes moved into an
`app/(site)/` **route group** (a group adds no path segment, so all URLs are unchanged):

```
app/
  layout.tsx            # root: html/body, ClerkProvider, fonts, AuroraGL — no chrome
  (site)/
    layout.tsx          # <Navbar/> + <main> + <Footer/>
    template.tsx        # page-transition scope
    page.tsx  gallery/  about/  items/[id]/  wishlist/  not-found.tsx
  admin/
    layout.tsx          # slim top bar: wordmark + AdminTabs + <UserButton>
    page.tsx            # Clerk guard → <AdminDashboard tab={searchParams.tab}>
```

### 16.2 Data model

`site_content` table (see `lib/db/schema.sql`, applied by `npm run db:setup`):

```sql
CREATE TABLE IF NOT EXISTS site_content (
  key         TEXT PRIMARY KEY,   -- 'home' | 'about' | 'item' | 'seo'
  value       JSONB NOT NULL,     -- partial override blob for that key
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

- **`lib/content/defaults.ts`** — `DEFAULT_CONTENT: SiteContent` is the source of truth for
  shape + fallback (seeded from the previously hardcoded strings).
- **`lib/content/merge.ts`** — `mergeContent(overrides)` deep-merges stored blobs onto the
  defaults (objects merge; arrays/primitives replace).
- **`lib/data/siteContent.ts`** — `getContent()` / `updateContent(key, value)`; Neon/mock
  swap mirrors `lib/data/items.ts`. The Neon reader tolerates a not-yet-migrated table
  (returns `{}` → defaults) so a fresh clone builds before `db:setup`.

Pages read `getContent()` in their server components (home hero, about copy, item seller
block) and in `generateMetadata` (per-page SEO), falling back to `lib/seo.ts` constants.

### 16.3 API

`app/api/site-content/route.ts` — both handlers guarded by `isAdmin()`:

- `GET` → merged `SiteContent` (prefills the admin forms).
- `PATCH` `{ key, value }` → validates `key ∈ CONTENT_KEYS`, upserts the blob, then
  `revalidatePath` for the affected routes (`/`, `/about`, `/gallery`, `/items/[id]`).

### 16.4 Admin UI

`AdminDashboard` switches panels by the `tab` prop: **Items** (existing `ItemForm` +
`AdminItemList`), **Content** (`AdminContentPanel` — Home/About/Item copy), **SEO**
(`AdminSeoPanel` — per-page title/description + OG image via `MediaPicker`). Tabs live in the
admin top bar (`AdminTabs`, `?tab=`). Design details in `docs/DESIGN_SYSTEM.md` §2.11.

---

## Quick Start Checklist (MVP)

- [ ] Create Neon account & database
- [ ] Create Next.js 16.2.10 project
- [ ] Install dependencies (incl. `@clerk/nextjs`)
- [ ] Set up `.env.local` with Clerk keys (see Part 7) + create the Clerk app
- [ ] Create database schema in Neon
- [ ] Create API routes (items, item detail)
- [ ] Create admin panel (ItemForm + Clerk-gated `/admin`)
- [ ] Set up Cloudinary account
- [ ] Upload sample images to Cloudinary
- [ ] Test database connection
- [ ] Build gallery & item detail pages
- [ ] Set up Vercel project
- [ ] Deploy and verify

---

## Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Connect to Neon CLI
neon connection-string --project-id <id> --branch main

# Create migration (when using Drizzle)
npm run db:migrate
```

---

## Documentation Links

- [Next.js Docs](https://nextjs.org/docs)
- [Neon Docs](https://neon.tech/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Next: Design system in Figma? Or start building components?**
