import express from "express"
import { getPendingDrivers,statusDriver} from "../controllers/adminController.js"
import { getDriverById } from "../controllers/driverIdController.js"
//whats happen 

const router = express.Router()

router.get("/drivers/pending",getPendingDrivers)
router.get("/drivers/:id",getDriverById)
router.get("/drivers/:id/status",statusDriver)


export default router
