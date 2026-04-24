import express from "express";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";
import tablesRouter from "./routes/tables.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

app.use("/api", healthRouter);
app.use("/api", tablesRouter);

// --- Aggiungi nuove route qui ---
// import productsRouter from "./routes/products.js";
// app.use("/api/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
