import express from "express";
import { applyDriver } from "../controllers/driverController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.post("/apply", authenticateToken, applyDriver);

export default router;
