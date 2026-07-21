import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: String,
      required: true,
    },

    firstName: String,

    lastName: String,

    image: String,

    birthDate: String,

    frontImage: String,
    backImage: String,
    licenseNumber: String,
    expirationDate: String,
    vehiclePicture: String,
    vehicleRegistration: String,
    vehicleBrand: String,
    vehicleModel: String,
    productionYear: String,
    plateNumber: String,
    vehicleColor: String,

    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Driver", driverSchema);
