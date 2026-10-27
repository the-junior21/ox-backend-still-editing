import express from "express";
import { addOffers, getOffers } from "../controllers/offersController.js";

const router = express.Router();

router.get("/", getOffers);
router.post("/addOffers",addOffers)

export default router;