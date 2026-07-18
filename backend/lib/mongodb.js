import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_NEW);

    console.log("the new MongoDB connected");

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;