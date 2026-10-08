import Driver from "../models/Driver.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import Admin from "../models/Admins.js";
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
                console.log("STATUS ROUTE HIT");

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
        );await User.findByIdAndUpdate(driver.user, {
  driverStatus: status,
});
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
            success:false,
            message:err.message
        })
    }
}


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. validate
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    // 2. reject duplicates
    const existing = await Admin.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });
    if (existing) {
      const field = existing.email === normalizedEmail ? "Email" : "Username";
      return res.status(409).json({ message: `${field} already in use` });
    }

    // 3. hash + create
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Admin.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // 4. never send the hash back
    res.status(201).json({
      message: "Account created",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

