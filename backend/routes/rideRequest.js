import express from "express";
import Ride from "../models/rideSchema.js";
import { io, onlineDrivers } from "../server.js";
import User from "../models/User.js";
import fetch from "node-fetch";

const router = express.Router();
async function sendPushNotification(expoPushToken, title, body, data = {}) {
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: "default",
        title,
        body,
        data,
      }),
    });
  } catch (err) {
    console.log("error push notification ", err);
  }
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

router.post("/", async (req, res) => {
  try {
    const { passengerId, depart, destination, pickupLocation } = req.body;
    if (
      !passengerId ||
      !depart ||
      !destination ||
      !pickupLocation?.lat ||
      !pickupLocation?.lng
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    const { lat, lng } = pickupLocation;

    const ride = await Ride.create({
      passengerId: passengerId,
      pickupLocation: {
        name: depart,
        location: {
          lat:lat,
          lng:lng,
        },
      },
      destination: {
        name: destination,
      },
      status: "SEARCHING",
    });

    const drivers = await User.find({
      role: "driver",
      isOnline: true,
      "location.lat": { $exists: true },
      "location.lng": { $exists: true },
    });
    console.log("Drivers found:", drivers.length);

    console.log("Online drivers map:", onlineDrivers);
    const nearbyDrivers = drivers.filter((driver) => {
      if (!driver.location) return false;
      const driverLat = driver.location.lat;
      const driverLng = driver.location.lng;
      const distance = getDistanceKm(lat, lng, driverLat, driverLng);
      return distance <= 100;
    });
    console.log("nearby drivers : ", nearbyDrivers.length);

    nearbyDrivers.forEach((driver) => {
      const socketId = onlineDrivers.get(driver._id.toString());
      if (socketId) {
        io.to(socketId).emit("new_ride_request", {
          rideId: ride._id,
          pickupLocation: { lat, lng, name: depart },
          destination: { name: destination },
        });
        console.log("Driver:", driver._id.toString(), "Socket:", socketId);
      }
      if (driver.pushToken) {
        sendPushNotification(
          driver.pushToken,
          "New Ride Request",
          `Pickup at ${depart}, destination ${destination}`,
          { rideId: ride._id },
        );
      }
    });
    res.status(201).json({
      message: "Ride request created",
      rideId: ride._id,
      status: ride.status,
    });
  } catch (error) {
    console.error("Ride Request Error: ", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});
export default router;
