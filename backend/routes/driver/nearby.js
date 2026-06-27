import express from "express"
import User from "../../models/User.js"
import {io} from "../../server.js"
import {onlineDrivers} from "../../server.js"


const router = express.Router()
function getDistanceKm(lat1,lng1,lat2,lng2){
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
    return R * c

}
router.post("/", async (req, res) => {
    // 1. Get current position from request
    const { lat, lng,rideId } = req.body

    if (lat == null || lng == null) {
        return res.status(400).json({ message: "Send lat and lng to search from!" })
    }
    

    try {
        // 2. Query for everything within 100km
        const drivers = await User.find({
            role:"driver",
            isOnline:true,
            "location.lat":{$exists:true},
            "location.lng":{$exists:true}
        })
        const nearbyDrivers = drivers.filter(driver =>{
            if(!driver.location) return false
            const driverLat = driver.location.lat
            const driverLng = driver.location.lng
            const distance = getDistanceKm(
                lat,
                lng,
                driverLat,
                driverLng
            )
            return distance <= 100
        })
        /*drivers.forEach(driver =>{
            const socketId = onlineDrivers.get(driver._id.toString())
            if(socketId){
                io.to(socketId).emit("new_ride_request",{
                    rideId,
                    passengerLocation:{lat,lng}
                })
            }
        })*/


        // 3. Return what we found
        res.json({
            count: nearbyDrivers.length,
            results: nearbyDrivers
        })
    } catch (err) {
        res.status(500).json({ 
            message: "Check if you have a 2dsphere index!", 
            error: err.message
        })
    }
})

export default router