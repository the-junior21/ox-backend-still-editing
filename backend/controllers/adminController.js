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
export const statusDriver = async (req, res) => {
    try{
        const {status} = req.body
        if(!["approved","rejected"].includes(status)){
            return res.status(400).json({
                success:false,
            message:"invalid status",
            })

        }
        const driver = await Driver.findByIdAndUpdate(
            req.params.id,
            { status},
            { new: true }
        );
        if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

        
        res.status(200).json({
            success:true,
            driver
        })

    }catch(err){
        res.status(500).json({
            success:true,
            message:err.message
        })
    }
}

