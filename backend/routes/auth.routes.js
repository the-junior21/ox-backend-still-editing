import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    console.log("BODY:", req.body);

  const { name, number} = req.body;

  if (!name?.trim() || !number?.trim()) {
  return res.status(400).json({ message: "Missing fields" });
}
  try {
   // const hashed = await bcrypt.hash(password, 10);

    let user = await User.findOne( {number:number.trim()})
      if(!user){
        user = await User.create({
          name:name.trim(),
          number:number.trim(),
        })
      }else{
        user.name=name.trim()
        await user.save()
      }
    
      //email,
      //password: hashed,
      //role : role || null,
    ;

    res.status(201).json({
      message: "User created",
      userId :user._id.toString(),
     });

  } catch (err) {
    console.error(err)
    if (err.code === 11000)
      return res.status(400).json({ message: "Numebr exists" });

    res.status(500).json({ message: "Server error" });
  }
});

export default router;
