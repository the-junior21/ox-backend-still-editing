import mongoose from "mongoose";

const LocationSubSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false },
);

const RideSchema = new mongoose.Schema(
  {
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    pickup: {
      type: LocationSubSchema,
      required: true,
    },
    destination: {
      type: LocationSubSchema,
      required: true,
    },
    stops: {
      type: [LocationSubSchema],
      default: [],
    },

    rideType: {
      type: String, // "classic" | "comfort" | "oxX"
      required: true,
    },
    distanceKm: {
      type: Number,
      required: true,
    },
    durationMin: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "SEARCHING",
        "ACCEPTED",
        "ARRIVED",
        "ONGOING",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "SEARCHING",
    },
  },
  { timestamps: true },
);

// No 2dsphere index — nearby-driver matching is done in application code
// via a plain Haversine distance function against driver.location.{lat,lng}.

export default mongoose.model("Ride", RideSchema);