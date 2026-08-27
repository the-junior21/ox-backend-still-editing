import express from "express";
import fetch from "node-fetch";
import Ride from "../models/rideSchema.js";
import User from "../models/User.js";
import { io, onlineDrivers } from "../server.js";

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

function isValidLocation(loc) {
  return (
    loc &&
    typeof loc.address === "string" &&
    loc.address.trim().length > 0 &&
    typeof loc.lat === "number" &&
    typeof loc.lng === "number"
  );
}

// POST /api/rides
router.post("/", async (req, res) => {
  try {
    const {
      passengerId,
      pickup,
      destination,
      stops = [],
      rideType,
      distanceKm,
      durationMin,
      price,
    } = req.body;

    if (!passengerId) {
      return res.status(400).json({ message: "passengerId is required" });
    }
    if (!isValidLocation(pickup)) {
      return res.status(400).json({ message: "Valid pickup { address, lat, lng } is required" });
    }
    if (!isValidLocation(destination)) {
      return res.status(400).json({ message: "Valid destination { address, lat, lng } is required" });
    }
    if (!rideType) {
      return res.status(400).json({ message: "rideType is required" });
    }
    if (typeof distanceKm !== "number" || typeof durationMin !== "number") {
      return res.status(400).json({ message: "distanceKm and durationMin must be numbers" });
    }
    if (typeof price !== "number") {
      return res.status(400).json({ message: "price must be a number" });
    }

    const validStops = Array.isArray(stops) ? stops.filter(isValidLocation) : [];

    const ride = await Ride.create({
      passengerId,
      pickup,
      destination,
      stops: validStops,
      rideType,
      distanceKm,
      durationMin,
      price,
      status: "SEARCHING",
    });

    // find nearby online drivers via plain Haversine, same pattern as before
    const drivers = await User.find({
      role: "driver",
      isOnline: true,
      "location.lat": { $exists: true },
      "location.lng": { $exists: true },
    });

    const SEARCH_RADIUS_KM = 15; // realistic dispatch radius, not 100km
    const MAX_DRIVERS_NOTIFIED = 5; // notify closest N, not everyone in range

    const nearbyDrivers = drivers
      .filter((driver) => driver.location)
      .map((driver) => ({
        driver,
        distance: getDistanceKm(
          pickup.lat,
          pickup.lng,
          driver.location.lat,
          driver.location.lng,
        ),
      }))
      .filter((d) => d.distance <= SEARCH_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, MAX_DRIVERS_NOTIFIED)
      .map((d) => d.driver);

    nearbyDrivers.forEach((driver) => {
      const socketId = onlineDrivers.get(driver._id.toString());
      if (socketId) {
        io.to(socketId).emit("new_ride_request", {
          rideId: ride._id,
          pickup,
          destination,
          stops: validStops,
          rideType,
          price,
        });
      }
      if (driver.pushToken) {
        sendPushNotification(
          driver.pushToken,
          "New Ride Request",
          `Pickup at ${pickup.address}, destination ${destination.address}`,
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
    console.error("Ride Request Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/rides/:id
router.get("/:id", async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("driverId", "name phoneNumber");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.json({
      status: ride.status,
      driver: ride.driverId,
      pickup: ride.pickup,
      destination: ride.destination,
      stops: ride.stops,
      rideType: ride.rideType,
      price: ride.price,
      distanceKm: ride.distanceKm,
      durationMin: ride.durationMin,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;