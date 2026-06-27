import express from "express"
import User from "../../models/User.js"
 const router = express.Router()
 router.get("/:id",async(req,res)=>{
    try{
        const user = await User.findById(req.params.id).select("name role number")
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        res.json(user)
    }catch(err){
        res.status(500).json({message:"server error"})
    }
 })
 export default router