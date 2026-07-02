import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    console.log("BODY:", req.body);

  const { name,email,number,password} = req.body;

  if (!name?.trim() || !email?.trim() || !number?.trim()|| !password?.trim()) {
  return res.status(400).json({ message: "Missing fields" });
}
  try {
    const existingEmail = await User.findOne({
      email:email.trim().toLowerCase(),
    })
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const existingNumber = await User.findOne({
      number: number.trim(),
    });
    if (existingNumber) {
      return res.status(400).json({
        message: "Number already exists",
      });
    }
    const hashed = await bcrypt.hash(password, 10);

     const user = await User.create({
          name:name.trim(),
          email:email.trim(),
          number:number.trim(),
          password:hashed,
          role:null,
        })
     
  //    email,
    //  password: hashed;
      //role : role || null,
   // ;

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
