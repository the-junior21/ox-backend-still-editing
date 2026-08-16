import express from "express"
import User from "../../models/User.js"
 const router = express.Router()
 router.get("/:id",async(req,res)=>{
    try{
        const user = await User.findById(req.params.id).select("name role number")
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        res.json(user)
    }catch(err){
        res.status(500).json({message:"server error"})
    }
 })
 router.patch("/pin", async (req, res) => {
  try {
    const { pin,userId } = req.body;

    if (pin !== null && !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: "Invalid PIN format" });
    }
 if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const user = await User.findByIdAndUpdate(
      userId, // set by your authMiddleware
      { pin },
      { new: true }
    );
      if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "PIN saved", pin: user.pin });
  } catch (error) {
    console.log("Error saving PIN:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.patch("/emergency-contacts", async (req, res) => {
  try {
    const { userId, contacts } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!Array.isArray(contacts)) {
      return res.status(400).json({ message: "contacts must be an array" });
    }

    if (contacts.length > 5) {
      return res.status(400).json({ message: "Maximum 5 contacts allowed" });
    }

    // validate each contact has name + phoneNumber
    const isValid = contacts.every((c) => c.name && c.phoneNumber);
    if (!isValid) {
      return res.status(400).json({ message: "Each contact needs a name and phoneNumber" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { emergencyContacts: contacts },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Emergency contacts saved", emergencyContacts: user.emergencyContacts });
  } catch (error) {
    console.log("Error saving emergency contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/get/pin/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("pin");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/get/emergency-contacts/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("emergencyContacts");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.emergencyContacts || []);
  } catch (err) {
    console.error("Get emergency contacts error:", err);
    res.status(500).json({ error: "Failed to fetch emergency contacts" });
  }
});

 export default router