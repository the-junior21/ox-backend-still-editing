import User from  "../../models/User.js"
//jus adding a comment to check 
import express from "express"
const router = express.Router()
router.post("/", async(req,res) => {
const {userId,lat,lng}= req.body
if(!userId || lat == null || lng == null){
    return res.status(400).json({message:"missing data"})
}
try{
    await User.findByIdAndUpdate(userId,{
        $set:{

            "location.lat":lat,
            "location.lng":lng,
            updatedAt: new Date(),
        }
    })
    res.json({success:true})
}catch (err){
    res.status(500).json({message:"server error"})
}
})
export default router

