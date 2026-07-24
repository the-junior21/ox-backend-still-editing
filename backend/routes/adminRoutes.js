import express from "express"
import {approveDriver, getPendingDrivers, rejectDriver} from "../controllers/adminController.js"
import { getDriverById } from "../controllers/driverIdController.js"
//whats happen 

const router = express.Router()

router.get("/drivers/pending",getPendingDrivers)
router.get("/drivers/:id",getDriverById)
router.get("/drivers/:id/approve",approveDriver)
router.get("/drivers/:id/rejected",rejectDriver)


export default router
