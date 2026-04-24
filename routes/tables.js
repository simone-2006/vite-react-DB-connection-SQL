import { Router } from "express";
import { getPool } from "../db.js";

const router = Router();

router.get("/db-test", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT DB_NAME() AS database_name, @@SERVERNAME AS server_name,
             (SELECT COUNT(*) FROM sys.tables) AS table_count
    `);
    res.json({ status: "success", info: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.get("/tables", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT TABLE_SCHEMA, TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_SCHEMA, TABLE_NAME
    `);
    res.json({ status: "success", data: result.recordset, count: result.recordset.length });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;
