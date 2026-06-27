import express from 'express'
import User from '../../models/User.js'

//this comment to see after force
const router = express.Router()
router.post("/save-push-token",async(req,res)=>{
    
    try{
        const {userId,pushToken} = req.body
        console.log("incoming req")
        console.log("userId ",userId)
        console.log("push token ",pushToken)
        if(!userId || !pushToken){
            return res.status(400).json({message:'Missing fields'})
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{pushToken})
        if(!updatedUser){
            return res.status(404).json({error:"user not found"})
        }
        console.log("token saved for user: ",updatedUser._id)
        res.status(200).json({message:'Push token saved ',user:updatedUser,})
    }catch(error){
        console.error(error)
        res.status(500).json({message:'Server error'})
    }
})
export default router