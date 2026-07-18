import express from "express";
import { applyDriver } from "../controllers/driverController.js";


const router = express.Router();


router.post("/apply",applyDriver);


export default router;