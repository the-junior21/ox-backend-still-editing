import express from "express"
import {getPendingDrivers} from "../controllers/adminController.js"
import { getDriverById } from "../controllers/driverIdController.js"
//whats happen 

const router = express.Router()

router.get("/drivers/pending",getPendingDrivers)
router.get("/driver/:id",getDriverById)


export default router
