import express from "express";
import authenticateToken from "../middleware/auth.js";
import User from "../models/User.js";
const router = express.Router();

router.post("/role", authenticateToken, async (req, res) => {
  console.log("ROLE BODY:", req.body);

  const { role } = req.body;
  const userId = req.user.id;

  if (!userId || !["driver", "passenger"].includes(role)) {
    return res.status(400).json({ message: "Invalid data" });
  }
  try {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Role updated",
      user: {
        id: user._id,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
