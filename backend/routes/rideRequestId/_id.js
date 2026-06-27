import exrpess from "express"
import Ride from "../../models/rideSchema.js"

const router = exrpess.Router()

router.get("/:id",async (req,res) => {
    try{
        const ride = await Ride.findById(req.params.id)
        .populate("driver","name number")

        if(!ride){
            return res.status(404).json({message:"Ride not found"})
        }
        res.json({
            status:ride.status,
            driver:ride.driver,
        })
    }catch(err){
        res.status(500).json({message:"server error"})
    }
})
export default router