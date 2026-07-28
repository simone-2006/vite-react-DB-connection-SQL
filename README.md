# React + Vite + Express + SQL Server Template

A full-stack template for projects using a React frontend and an Express backend connected to SQL Server.

## Stack

| Layer      | Technology                     |
| ----------- | ------------------------------ |
| Frontend    | React 19, Vite 8               |
| Styling     | Tailwind CSS 4, MUI 9, Emotion |
| Icons       | React Icons                    |
| Backend     | Express 5                      |
| Database    | SQL Server (mssql)             |

## Project Structure

```
├── server.js          # Express setup and route mounting
├── db.js              # SQL Server connection pool (singleton)
├── routes/
│   ├── health.js      # GET /api/test, /api/health
│   └── tables.js      # GET /api/db-test, /api/tables
└── src/
    ├── App.jsx
    ├── components/
    ├── services/
    │   └── api.js     # HTTP client for the backend
    └── pages/
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the database

Copy `.env.example` to `.env` and fill in your database credentials:

```env
PORT=5000
DB_USER=sa
DB_PASSWORD=password
DB_SERVER=localhost
DB_NAME=DatabaseName
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERT=true
```

### 3. Start the application

```bash
# Run frontend and backend together
npm run dev:all

# Or run them separately
npm run dev      # Vite → http://localhost:5173
npm run server   # Express → http://localhost:5000
```

## Adding a New Route

### 1. Create `routes/products.js`

```js
import { Router } from "express";
import { getPool, sql } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM PRODUCTS");
    res.json({ status: "success", data: result.recordset });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("id", sql.Int, req.params.id);

    const result = await request.query(
      "SELECT * FROM PRODUCTS WHERE ID = @id"
    );

    if (!result.recordset[0]) {
      return res
        .status(404)
        .json({ status: "error", error: "Not found" });
    }

    res.json({ status: "success", data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;
```

### 2. Register the route in `server.js`

```js
import productsRouter from "./routes/products.js";

app.use("/api/products", productsRouter);
```

### 3. Add the frontend service in `src/services/api.js`

```js
export class ProductsService {
  static getAll() {
    return ApiService.get("/products");
  }

  static getById(id) {
    return ApiService.get(`/products/${id}`);
  }
}
```

## Calling the API from the Frontend

To call the API from the frontend, use the `ApiService` defined in `src/services/api.js`. Make sure it is configured to point to your backend (for example, `http://localhost:5000/api`).

Example usage:

```js
import { ProductsService } from "./services/api.js";

// Get all products
const products = await ProductsService.getAll();

// Get a specific product by ID
const product = await ProductsService.getById(1);
```

Inside a React component, you can use `useEffect` to fetch data when the component mounts:

```jsx
import { useEffect, useState } from "react";
import { ProductsService } from "../services/api.js";

function ProductsList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductsService.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```
