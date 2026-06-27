import User from "../models/User.js";
import express from "express";
const router = express.Router();


router.post("/role", async (req, res) => {
      console.log("ROLE BODY:", req.body);

  const { userId, role } = req.body;

  if (!userId || !["driver", "passenger"].includes(role)) {
    return res.status(400).json({ message: "Invalid data" });
  }
try {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Role updated",
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;