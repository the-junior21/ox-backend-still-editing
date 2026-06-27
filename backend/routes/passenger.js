import express from "express"
import User from "../models/User.js"


const router = express.Router()

router.post("/request",async (req,res)=>{
    try{
        const {passengerId,lat,lng,destination}=req.body
        const drivers = await User.find({
            isOnline:true,
            role:"driver",
            location:{
                $near:{
                    $geometry:{
                        type:"Point",
                        coordinates:[lng,lat]
                    }
                }
            }
        })
        console.log("Nearby drivers:",drivers.map(d => d._id))

        return res.json({
            message:"Request sent to driver",
            drivers})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
})
export default router