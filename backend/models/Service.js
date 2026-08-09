import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {


    title: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);