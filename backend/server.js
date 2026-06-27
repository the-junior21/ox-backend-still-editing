import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.route.js";
import userRoutes from "./routes/users/user.routes.js";
import driverStatus from "./routes/driver/status.js";
import passengerRoute from "./routes/passenger.js";
import updateDriverLocation from "./routes/driver/location.js";
import updatePassengerLocation from "./routes/passengerLocation/location.js";
import nearbyDrivers from "./routes/driver/nearby.js";
import rideRequest from "./routes/rideRequest.js";
import rideRequestId from "./routes/rideRequestId/:id.js";
import saveDriverPushToken from './routes/driver/savePushToken.js'
import saveOneSignalId from "./routes/saveOneSignalId.js"
import { createServer } from "http";
import { Server } from "socket.io";
import Ride from "./models/rideSchema.js";
import User from "./models/User.js";
import savePushToken from "./routes/users/savePushTokenn.js"
import fetch from "node-fetch"


dotenv.config();
const sendPushNotification = async(expoPushToken,title,body,data = {}) =>{
  try{
await fetch("https://exp.host/--/api/v2/push/send",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({
            to:expoPushToken,
            sound:"default",
            title,
            body,
            data,
          }),
        })
        }catch(err){
    console.log("error sending push not ",err)
  }
}

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineDrivers = new Map();
const onlinePassengers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("accept_ride", async ({ driverId, rideId }) => {
    try {
      const ride = await Ride.findById(rideId);
      const passenger = await User.findById(ride.passengerId)
      const driver = await User.findById(ride.driverId)
      console.log("passenger fetched : ",passenger?.number)
      console.log("pickup location : ",ride.pickupLocation)
      if (!ride) return;
      if(passenger?.psuhToken){
        await fetch("https://exp.host/--/api/v2/push/send",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({
            to:passenger.pushToken,
            title:"Driver found",
            body:"your driver is on the way",
          }),
        })
      }
      

      if (ride.status !== "SEARCHING") {
        console.log("already taken");
        return;
      }

      const passengerSocketId = onlinePassengers.get(
        ride.passengerId.toString(),
      );

      console.log("Looking for passenger:", ride.passengerId.toString());
      console.log("Found socket:", passengerSocketId);

      if (passengerSocketId) {
        io.to(passengerSocketId).emit("ride_accepted", {
          rideId: ride._id,
          driverId,
          driverPhone: driver?.number

        });
      }
      console.log("passenger map",onlinePassengers)
      console.log("ride passenger",ride.passengerId.toString())
      console.log("found socket",passengerSocketId)


      socket.emit("ride_confirmed", {
        rideId: ride._id,
        passengerPhone:
        passenger.number,
        pickupLocation:
        ride.pickupLocation
      });

      await User.findByIdAndUpdate(driverId, {
        status: "ON_TRIP",
      });

      ride.status = "ACCEPTED";
      ride.driverId = driverId;
      await ride.save();

      console.log("ride accepted by", driverId);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("register_passenger", (passengerId) => {
    onlinePassengers.set(passengerId, socket.id);
    console.log("Passenger registered:", passengerId);
  });
  socket.on("driver_online", (driverId) => {
    onlineDrivers.set(driverId, socket.id);
    console.log("✅ Driver ONLINE:", driverId, socket.id);
  });
  socket.on("passenger_online", (passengerId) => {
    onlinePassengers.set(passengerId, socket.id);
    console.log("✅ passenger ONLINE:", passengerId, socket.id);
  });
  socket.on("ride_completed",async({driverId,rideId}) =>{
    try{
      const ride = await Ride.findById(rideId)
      const passenger = await User.findById(ride.passengerId)
      const driver = await User.findById(ride.driverId)
      if(!ride) return;
      if(passenger?.pushToken){
        await fetch("https://exp.host/--/api/v2/push/send",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({
            to:passenger.pushToken,
            title:"ride completed",
            body:"thanks for using ox",
          }),
        })
      }
      ride.status = "COMPLETED"
      await ride.save()
      await User.findByIdAndUpdate(driverId,{
        status : "OFF_TRIP"
      })
      const passengerSocketId = onlinePassengers.get(
        ride.passengerId.toString(),
      )
      if(passengerSocketId){
        io.to(passengerSocketId).emit("ride_completed",{
          rideId:ride._id,
        })
      }
    }catch(error){
      console.log(error)    }
  })
  socket.on("cancel_ride",async({rideId})=>{
    const ride = await Ride.findById(rideId)
    if(!ride) return
    ride.status = "CANCELLED"
    await ride.save()
    io.emit("ride_cancelled",{rideId})
  })
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove from maps
    [...onlineDrivers].forEach(
      ([id, sId]) => sId === socket.id && onlineDrivers.delete(id),
    );//gggggg
    [...onlinePassengers].forEach(
      ([id, sId]) => sId === socket.id && onlinePassengers.delete(id),
    );
  });
  
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/auth", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/driver", driverStatus);
app.use("/api/passenger", passengerRoute);
app.use("/api/driver/location", updateDriverLocation);
app.use("/api/passenger/location", updatePassengerLocation);
app.use("/api/driver/nearby", nearbyDrivers);
app.use("/api/routes/rideRequest", rideRequest);
app.use("/api/routes/rideRequestId", rideRequestId);
app.use("/api/users", savePushToken);
app.use("/api/users", saveDriverPushToken);
app.use("/api/save-onesignal-id", saveOneSignalId);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io, onlineDrivers, onlinePassengers };

export default app;
