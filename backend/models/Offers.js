import mongoose from "mongoose";

const offersSchema = new mongoose.Schema(
  {


   title: {
    type:String,
    required:true,
      
    },

    image: {
      type: String,
      required: true,
    },
    link: {
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

export default mongoose.model("Offers", offersSchema);