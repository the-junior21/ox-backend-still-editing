import express from "express";
import mongoose from "mongoose";
import User from "../../models/User.js";

const router = express.Router();

router.patch("/status", async (req, res) => {
  try {
    const { userId, isOnline } = req.body;
console.log("Request body:", req.body);

    // Validate input
    if (!userId || typeof isOnline !== "boolean") {
      return res.status(400).json({ message: "Invalid userId or isOnline" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid driver ID" });
    }

    // Update driver
    const driver = await User.findOneAndUpdate(
      { _id: userId, role: "driver" },
      { isOnline },
      { new: true } // return updated document
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    console.log("Driver updated:", driver);

    return res.json({
      message: isOnline ? "Driver is ONLINE" : "Driver is OFFLINE",
      userId: driver._id,
      isOnline: driver.isOnline,
    }
);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
router.get("/status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const driver = await User.findById(userId).select("isOnline");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    return res.status(200).json({
      success: true,
      isOnline: driver.isOnline,
    });
  } catch (error) {
    console.error("Get driver status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get driver status",
    });
  }
});

export default router;
