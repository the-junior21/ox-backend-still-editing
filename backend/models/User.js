import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true, unique: false },

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
        lat:Number,
        lng:Number
    },
    status:{
      type:String,
      enum:["ON_TRIP","OFF_TRIP"],
      default:"OFF_TRIP"
    },
    pushToken:{
      type:String,
    },
    oneSignalId:{type:String}

  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
