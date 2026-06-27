import mongoose from "mongoose"

const RideSchema = new mongoose.Schema(
    {
        passengerId :{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        driverId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null,
        },
        pickupLocation:{
            name:String,
            location:{
                type:{
                    type:String,
                    enum:["Point"],
                    default:"Point",
                },
                coordinates:{
                    type:[Number],
                    required:true,
                },
            },
        },
        destination:{
            name:String,
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
    {timestamps:true}
)
RideSchema.index({"pickup.location":"2dsphere"})
export default mongoose.model("Ride",RideSchema)