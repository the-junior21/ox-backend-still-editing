import Driver from "../models/Driver.js";
import Service from "../models/Service.js";

export const getServices = async (req, res) => {
  console.log("get service route reached");
  try {
    const services = await Service.find({ active: true })
      .sort({ order: 1 });

    res.status(200).json(services);
  
  } catch (error) {
        console.error("Error getting services:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
