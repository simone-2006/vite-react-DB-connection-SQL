# React + Vite + Express + SQL Server Template

Template full-stack per progetti con React frontend e Express backend collegato a SQL Server.

## Stack

| Layer    | Tecnologia                     |
| -------- | ------------------------------ |
| Frontend | React 19, Vite 8               |
| Styling  | Tailwind CSS 4, MUI 9, Emotion |
| Icone    | React Icons                    |
| Backend  | Express 5                      |
| Database | SQL Server (mssql)             |

## Struttura

```
├── server.js          # Setup Express + mounting delle route
├── db.js              # Connection pool SQL Server (singleton)
├── routes/
│   ├── health.js      # GET /api/test, /api/health
│   └── tables.js      # GET /api/db-test, /api/tables
└── src/
    ├── App.jsx
    ├── components/
    ├── services/
    │   └── api.js     # Client HTTP verso il backend
    └── pages/
```

## Setup

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura il database

Copia `.env.example` in `.env` e compila con i tuoi dati:

```env
PORT=5000
DB_USER=sa
DB_PASSWORD=password
DB_SERVER=localhost
DB_NAME=NomeDatabase
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERT=true
```

### 3. Avvia

```bash
# Frontend e backend insieme
npm run dev:all

# Oppure separati
npm run dev      # Vite → http://localhost:5173
npm run server   # Express → http://localhost:5000
```

## Aggiungere una nuova route

### 1. Crea `routes/products.js`

```js
import { Router } from "express";
import { getPool, sql } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM PRODOTTI");
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
    const result = await request.query("SELECT * FROM PRODOTTI WHERE ID = @id");
    if (!result.recordset[0])
      return res.status(404).json({ status: "error", error: "Non trovato" });
    res.json({ status: "success", data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;
```

### 2. Registra in `server.js`

```js
import productsRouter from "./routes/products.js";
app.use("/api/products", productsRouter);
```

### 3. Aggiungi il service frontend in `src/services/api.js`

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

### come chiamare l'api nel frontend

Per chiamare l'API dal frontend, utilizza il servizio `ApiService` definito in `src/services/api.js`. Assicurati che `ApiService` sia configurato per puntare al backend (ad esempio, `http://localhost:5000/api`).

Esempio di utilizzo:

```js
import { ProductsService } from "./services/api.js";

// Ottieni tutti i prodotti
const products = await ProductsService.getAll();

// Ottieni un prodotto specifico per ID
const product = await ProductsService.getById(1);
```

Nel componente React, puoi usare `useEffect` per chiamare l'API al caricamento:

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
        console.error("Errore nel caricamento dei prodotti:", error);
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
