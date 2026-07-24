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
export const approveDriver = async (req, res) => {
    try{
        const driver = await Driver.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );
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

export const rejectDriver = async (req, res) => {
    try{
        const driver = await Driver.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            { new: true }
        );
        res.status(200).json({
            success:true,
            driver
        })

    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message

        })
    }
}