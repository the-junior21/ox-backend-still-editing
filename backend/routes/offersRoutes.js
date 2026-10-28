import express from "express";
import { addOffers,updateOffers, getOffers } from "../controllers/offersController.js";

const router = express.Router();

router.get("/", getOffers);
router.post("/addOffers",addOffers)
router.patch("/updateOffers/:id",updateOffers)

export default router;