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

    const existingOffer = await Offers.findOne({ title });

    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: "The offer already exists",
      });
    }

    await Offers.create({
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
export const updateOffers = async (req, res) => {
  try {
    const { title, image, link, active, order } = req.body;

    const offer = await Offers.findByIdAndUpdate(
      req.params.id,
      { title, image, link, active, order },
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      offer,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

