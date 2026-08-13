import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    verificationCodeExpires: { type: Date, default: null },
    passwordResetCode: {
      type: String,
      default: null,
    },

    passwordResetCodeExpires: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["passenger", "driver"],
      default: "passenger",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ["ON_TRIP", "OFF_TRIP"],
      default: "OFF_TRIP",
    },
    driverStatus: {
  type: String,
  enum: ["none", "pending", "approved", "rejected"],
  default: "none",
},
    pushToken: {
      type: String,
    },
    oneSignalId: { type: String },
    pin: {
  type: String,
  select: false, // don't return it by default in normal queries, for security
},
emergencyContacts: [
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
],
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
