import express from "express"
import { getPendingDrivers,statusDriver} from "../controllers/adminController.js"
import { getDriverById } from "../controllers/driverIdController.js"
//whats happen 
import { login } from "../controllers/adminController.js"
import { register } from "../controllers/adminController.js"

const router = express.Router()

router.get("/drivers/pending",getPendingDrivers)
router.get("/drivers/:id",getDriverById)
router.patch("/drivers/:id/status",statusDriver)
router.post("/auth/register",register)
router.post("/auth/login",login)


export default router
