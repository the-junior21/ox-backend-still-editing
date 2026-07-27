import Driver from "../models/Driver.js";
import User from "../models/User.js";

export const applyDriver = async (req, res) => {
  console.log("Apply driver route reached");
  try {
    const userId = req.user.id;
    const existingDriver = await Driver.findOne({
      user: userId,
    });
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver application already exists",
      });
    }
    if (existingDriver.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "Application already under review.",
      });
    }
    if (existingDriver.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "You are already a driver.",
      });
    }
    if (existingDriver.status === "rejected") {
      return Object.assign(existingDriver, req.body);
      existingDriver.status = "pending";
      await existingDriver.save();
      await User.findByIdAndUpdate(userId, {
    driverStatus: "pending",
  });

  return res.status(200).json({
    success: true,
    message: "Application resubmitted successfully",
    driver: existingDriver,
  });
    }
    const driver = await Driver.create({
      user: userId,
      ...req.body,
    });
    await User.findByIdAndUpdate(userId, {
  driverStatus: "pending",
});
    res.status(201).json({
      success: true,
      message: "Application submitted",
      driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
