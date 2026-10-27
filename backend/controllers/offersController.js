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

export const addOffers = async (req, res) => {
  try {
    const { title, image, active, order, link } = req.body;

    if (!title || !image || !link || order === undefined || active === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingOffer = await Offer.findOne({ title });

    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: "The offer already exists",
      });
    }

    await Offer.create({
      title,
      image,
      active,
      order,
      link,
    });

    return res.status(201).json({
      success: true,
      message: "The offer was created successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

