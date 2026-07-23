import express from "express"
import {getPendingDrivers} from "../../controllers/adminController.js"

const router = express.Router()

router.get("/drivers/pending",getPendingDrivers)

export default router
