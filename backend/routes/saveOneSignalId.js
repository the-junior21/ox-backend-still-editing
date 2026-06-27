import Driver from "../models/User.js";
import express from "express";
const router = express.Router();

router.post ("/",async (req,res)=>{
    try{
        const {userId,oneSignalId} = req.body
        if(!userId || !oneSignalId){
            return res.status(400).json({error:"Missing data"})
        }
        const driver = await Driver.findByIdAndUpdate(userId,{oneSignalId:oneSignalId},{new:true})
        console.log("Body: ",req.body)
        const driverid = await Driver.findById(userId)
        console.log("friver ",driverid)
        if(!driver){
            return res.status(404).json({error:"Driver not found"})
        }
        res.json({message:"onesignal id saved ", driver})
    }catch(err){
        console.log(err)
        res.status(500).json({error:"server error"})
    }
})
export default router