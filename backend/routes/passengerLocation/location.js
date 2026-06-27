import User from  "../../models/User.js"

import express from "express"
const router = express.Router()
router.post("/", async(req,res) => {
const {passengerId,lat,lng}= req.body
if(!passengerId || lat == null || lng == null){
    return res.status(400).json({message:"missing data"})
}
try{
    await User.findByIdAndUpdate(passengerId,{
        $set:{
            "location.lat":parseFloat(lat),
            "location.lng":parseFloat(lng),
            updatedAt: new Date(),
        }
    })
    res.json({success:true})
}catch (err){
    res.status(500).json({message:"server error"})
}
})
export default router

