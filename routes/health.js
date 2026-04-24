import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
  res.json({ status: "success", message: "Express.js is working!", timestamp: new Date().toISOString() });
});

router.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

export default router;
