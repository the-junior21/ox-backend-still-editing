import express from "express";
import { getOffers } from "../controllers/offersController.js";

const router = express.Router();

router.get("/", getOffers);

export default router;