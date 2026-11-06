import express from "express";
import { addOffers,updateOffers, getOffers,deleteOffers } from "../controllers/offersController.js";

const router = express.Router();

router.get("/", getOffers);
router.post("/addOffers",addOffers)
router.patch("/updateOffers/:id",updateOffers)
router.delete("/deleteOffers/:id",deleteOffers)

export default router;