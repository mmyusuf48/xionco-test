# Product & Inventory Management App

A fullstack product and inventory management application built with Vue.js, Express.js, and PostgreSQL.

The application provides product management, stock management, purchase management, and a dashboard for monitoring inventory and purchase activities.

## Tech Stack

### Frontend

- Vue 3
- Vite
- TypeScript
- TailwindCSS
- Axios

### Backend

- Node.js
- Express.js
- PostgreSQL
- pg
- dotenv
- CORS

### Database

- PostgreSQL
- Neon PostgreSQL (Cloud Database)

The application uses **Neon PostgreSQL** as the cloud database.

---

## Features

### Dashboard

Dashboard provides an overview of:

- Total products
- Total stock
- Total completed purchases
- Total purchase value
- Low stock products
- Out of stock products
- Recent purchases
- Purchase status

Purchase statistics only include purchases with `COMPLETED` status.

---

### Product Management

Features:

- Create product
- View product list
- View product detail
- Update product
- Delete product
- Manage product price
- Manage product description

Product deletion is restricted when the product is already referenced by stock or purchase transaction data.

---

### Stock Management

Features:

- View stock for all products
- View total stock
- View low stock products
- View out of stock products
- Update stock
- View stock status

Stock status:

| Quantity | Status |
| -------- | ------ |
| 0        | Out of Stock |
| 1 - 10   | Low Stock |
| > 10     | Available |

Stock represents the current available inventory for each product.

---

### Purchase Management

Features:

- Create purchase
- View purchase list
- View purchase detail
- Update purchase quantity
- Update purchase status
- Cancel purchase
- View purchase status
- View purchase price
- View purchase total
- View purchase date

Purchase statuses:

| Status | Description |
| ------ | ----------- |
| PENDING | Purchase is waiting for completion |
| COMPLETED | Purchase has been completed |
| CANCELLED | Purchase has been cancelled |

---

## Purchase & Stock Flow

Purchase status determines whether the transaction affects stock.

### Create Purchase

When a purchase is created, its initial status is `PENDING`.

```text
Create Purchase
       ↓
Purchase PENDING
       ↓
Stock unchanged
```

A pending purchase does not increase the stock.

---

### Complete Purchase

When a pending purchase is completed:

```text
Pending Purchase
       ↓
Status → COMPLETED
       ↓
Stock increases
```

The purchase quantity is added to the current stock.

```text
Current Stock + Purchase Quantity
```

---

### Cancel Pending Purchase

If a pending purchase is cancelled:

```text
Pending Purchase
       ↓
Status → CANCELLED
       ↓
Stock unchanged
```

Because the purchase was never completed, stock is not changed.

---

### Cancel Completed Purchase

If a completed purchase is cancelled:

```text
Completed Purchase
       ↓
Cancel Purchase
       ↓
Stock decreases
       ↓
Purchase → CANCELLED
```

The stock is reduced by the purchase quantity.

```text
Current Stock - Purchase Quantity
```

The system prevents stock from becoming negative.

---

## Purchase Calculation

Purchase total is calculated using:

```text
total = price × quantity
```

The product price is taken from the product master data when creating or updating a purchase.

Example:

```text
Product Price = Rp 500.000
Quantity      = 3

Total         = Rp 500.000 × 3
              = Rp 1.500.000
```

---

## Dashboard Calculation

### Total Products

The total number of products registered in the system.

### Total Stock

The total current stock quantity of all products.

### Total Purchase

Only purchases with `COMPLETED` status are counted.

```text
COMPLETED
```

Pending and cancelled purchases are not included.

### Total Purchase Value

Only completed purchases are included in the total purchase value.

```sql
SELECT COALESCE(SUM(total), 0)
FROM purchases
WHERE status = 'COMPLETED';
```

Pending and cancelled purchases are not included in the total purchase value.

---

## Stock Calculation

Stock is maintained based on completed purchase transactions.

### Completed Purchase

When a purchase becomes completed:

```text
Current Stock + Purchase Quantity
```

### Cancelled Completed Purchase

When a completed purchase is cancelled:

```text
Current Stock - Purchase Quantity
```

### Pending Purchase

Pending purchases do not affect stock:

```text
Current Stock
```

The system validates the current stock before decreasing it to prevent negative stock.

---

## Database

The application uses **Neon PostgreSQL**, a cloud-hosted PostgreSQL database.

The backend connects to the Neon database using the PostgreSQL connection string configured through the `DATABASE_URL` environment variable.

The database schema is available at:

```text
database/schema.sql
```

The database consists of:

- `products`
- `stocks`
- `purchases`

### Database Relationship

```text
products
   │
   ├── stocks
   │
   └── purchases
```

Each product can have one stock record and can have multiple purchase transactions.

---

## Database Structure

### Products

Stores product master data.

Main fields:

- `id`
- `name`
- `price`
- `description`
- `created_at`
- `updated_at`

---

### Stocks

Stores the current inventory quantity for each product.

Main fields:

- `id`
- `product_id`
- `quantity`
- `created_at`
- `updated_at`

---

### Purchases

Stores purchase transaction history.

Main fields:

- `id`
- `product_id`
- `quantity`
- `price`
- `total`
- `status`
- `created_at`
- `updated_at`

---

## Data Integrity

The application includes validation to maintain data consistency:

- Purchase quantity must be a positive integer.
- Product must exist before creating a purchase.
- Stock cannot become negative.
- Cancelled purchases cannot be updated.
- Cancelled purchases cannot be cancelled again.
- Product deletion is restricted when related transaction data exists.
- Purchase and stock updates use database transactions.
- Purchase quantity changes update the related stock accordingly.
- Purchase cancellation updates the purchase status to `CANCELLED`.
- Pending purchases do not affect stock.
- Only completed purchases affect stock.
- Only completed purchases are included in purchase statistics.

---

## Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=3000
DATABASE_URL=your_neon_database_connection_string
```

`DATABASE_URL` should contain the PostgreSQL connection string provided by Neon.

Example:

```env
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

Do not commit the `.env` file to the repository.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/mmyusuf48/xionco-test
```

Enter the project directory:

```bash
cd xionco-test
```

---

## Run Backend

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

Backend will run on:

```text
http://localhost:3000
```

---

## Run Frontend

Open another terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## API Endpoints

### Products

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

---

### Stocks

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/stocks` | Get all stocks |
| GET | `/api/stocks/:id` | Get stock by ID |
| GET | `/api/stocks/product/:productId` | Get stock by product |
| GET | `/api/stocks/summary` | Get stock summary |
| POST | `/api/stocks` | Create stock |
| PUT | `/api/stocks/:id` | Update stock |
| DELETE | `/api/stocks/:id` | Delete stock |

---

### Purchases

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/purchases` | Get all purchases |
| GET | `/api/purchases/:id` | Get purchase by ID |
| POST | `/api/purchases` | Create purchase |
| PUT | `/api/purchases/:id` | Update purchase |
| PATCH | `/api/purchases/:id/cancel` | Cancel purchase |

---

## Application Pages

```text
Dashboard
Products
Stock
Purchases
```

### Dashboard

Provides an overview of:

- Product count
- Current stock
- Completed purchases
- Total purchase value
- Low stock products
- Out of stock products
- Recent purchase transactions

---

### Products

Manages product master data.

Available operations:

- Create
- Read
- Update
- Delete

---

### Stock

Monitors and manages current inventory.

Available information:

- Product
- Product price
- Current stock
- Stock status

---

### Purchases

Manages purchase transactions.

Available information:

- Product
- Quantity
- Price
- Total
- Status
- Purchase date

Available operations:

- Create purchase
- Update purchase
- Complete purchase
- Cancel purchase

---

## Project Structure

```text
xionco-test/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── products/
│   │   │   ├── stocks/
│   │   │   └── purchases/
│   │   │
│   │   ├── pages/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── database/
│   └── schema.sql
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
└── README.md
```

---

## Database Schema

The database schema is available in:

```text
database/schema.sql
```

The schema contains the following tables:

```text
products
stocks
purchases
```

The `stocks` and `purchases` tables reference the `products` table through `product_id`.

---

## Notes

- The application uses Neon PostgreSQL as the cloud database.
- Make sure the `DATABASE_URL` environment variable contains a valid Neon PostgreSQL connection string.
- The backend must be running before the frontend accesses the API.
- CORS must be enabled on the backend.
- The frontend API URL should point to the running backend server.
- Purchase and stock operations use database transactions to maintain data consistency.
- Pending purchases do not increase stock.
- Completed purchases increase stock.
- Cancelling a completed purchase decreases stock.
- Cancelling a pending purchase does not change stock.
- Product deletion is restricted when the product is already referenced by stock or purchase records.
- The `.env` file must not be committed to the repository.

---

## Future Improvements

Possible future improvements:

- Authentication and authorization
- Pagination
- Product search and filtering
- Purchase filtering by status
- Stock history
- Purchase history
- Supplier management
- Reports and export
- Low stock notifications
- Soft delete for products
- Purchase approval workflow
- Role-based access control
- Automated testing

---

## License

This project was created as a technical test project for demonstration purposes.