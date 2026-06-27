import express from "express"
import User from "../../models/User.js"

const router = express.Router()
router.post("/savePushToken",async(req,res)=>{
    const{userId,pushToken} = req.body
    try{
        await User.findByIdAndUpdate(userId,{
            pushToken,
        })
        res.json({message:"Token saved"})
    }catch(err){
        res.status(500).json({error:err.message})
    }
})
export default router