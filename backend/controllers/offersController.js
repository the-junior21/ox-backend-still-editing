import Driver from "../models/Driver.js";
import Offers from "../models/Offers.js";

export const getOffers = async (req, res) => {
  console.log("get offer route reached");
  try {
    const offers = await Offers.find({ active: true })
      .sort({ order: 1 });

    res.status(200).json(offers);
  
  } catch (error) {
        console.error("Error getting offers:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
