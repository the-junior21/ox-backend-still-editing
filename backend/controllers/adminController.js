import Driver from "../models/Driver.js"

export const getPendingDrivers = async (req,res)=>{
    try{
        const drivers = await Driver.find({
            status:"pending",
        }).select(
            "firstName lastName brand model status createdAt"
        )
        res.status(200).json({
            success:true,
            drivers,
        })

    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })

    }
}