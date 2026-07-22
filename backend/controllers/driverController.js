import Driver from "../models/Driver.js";

export const applyDriver = async (req, res) => {
  try {
    console.log("Apply driver route reached");
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
    const driver = await Driver.create({
      user: userId,
      ...user.body,
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
