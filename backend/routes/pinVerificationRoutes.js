router.patch("/pin", async (req, res) => {
  try {
    const { pin,userId } = req.body;

    if (!pin || !/^\d{4}$/.test(pin)) {
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