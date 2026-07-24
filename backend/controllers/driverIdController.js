import Driver from "../models/Driver.js"

import mongoose from "mongoose";

export const getDriverById = async(req,res)=>{
    try{
        const {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid driver id",
  });
}
        const driver = await Driver.findById(id)
        if(!driver){
            return res.status(404).json({
                success:false,
                message:"driver not found"
            })
        } 
        res.status(200).json({
            success:true,
            driver,
        })

    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })

    }


}