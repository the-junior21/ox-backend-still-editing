import Driver from "../models/Driver.js";


export const applyDriver = async(req,res)=>{

try{

const driver = await Driver.create(req.body);


res.status(201).json({
    success:true,
    message:"Application submitted",
    driver
});


}catch(error){

res.status(500).json({
    success:false,
    message:error.message
});

}

};