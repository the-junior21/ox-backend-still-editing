import bcrypt from "bcryptjs";
import express from "express";
import User from "../models/User.js";
import resend from "../utils/mail.js";

const router = express.Router();
router.post("/login", async (req, res) => {
  console.log("body:", req.body);
  const { email, password } = req.body;
  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "Missing fields" });
  }
  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!user) {
      return res.status(400).json({ message: "Email not found " });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    return res.status(200).json({
      message: "Login successful",
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login" });
  }
});
router.post("/signup", async (req, res) => {
  console.log("BODY:", req.body);

  const { name, email, number, password } = req.body;

  if (!name?.trim() || !email?.trim() || !number?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "Missing fields" });
  }
  try {
    const existingEmail = await User.findOne({
      email: email.trim().toLowerCase(),
    });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const existingNumber = await User.findOne({
      number: number.trim(),
    });
    if (existingNumber) {
      return res.status(400).json({
        message: "Number already exists",
      });
    }
    const hashed = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    console.log("4. Creating user");

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      number: number.trim(),
      password: hashed,
      role: null,
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
    });
    console.log("5. User created");
    console.log("6. Verifying SMTP");

    try {
      console.log("8. Sending email");

      const { data, error } = await resend.emails.send({
        from: "OX <onboarding@resend.dev>", // sandbox sender until you verify a domain
        to: user.email, // swap back to user.email when done testing
        subject: "Verify your email",
        html: `
      <h2>Welcome to OX!</h2>
      <p>Your verification code is:</p>
      <h1>${verificationCode}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
      });

      if (error) {
        console.error("Resend error:", error);
      } else {
        console.log("9. Email sent:", data.id);
      }
    } catch (mailError) {
      console.error("Mail Error:", mailError);
    }

    res.status(201).json({
      message: "Verification code sent",
      userId: user._id.toString(),
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000)
      return res.status(400).json({ message: "Numebr exists" });

    res.status(500).json({ message: "Server error" });
  }
});
router.post("/verify", async (req, res) => {
  const { userId, code } = req.body;
  if (!userId || !code) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }
    if (user.verificationCode !== code) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }
    if (new Date() > user.verificationCodeExpires) {
      return res.status(400).json({
        message: "Verification code expired",
      });
    }
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();
    return res.status(200).json({
      message: "Email verified successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});
router.post("/resend-code", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "Missing userId",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;

    await user.save();

    // Send email here
    try {
      console.log("8. Sending email");

      const { data, error } = await resend.emails.send({
        from: "OX <onboarding@resend.dev>", // sandbox sender until you verify a domain
        to: user.email, // swap back to user.email when done testing
        subject: "Verify your email",
        html: `
      <h2>Welcome to OX!</h2>
      <p>Your verification code is:</p>
      <h1>${verificationCode}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
      });

      if (error) {
        console.error("Resend error:", error);
      } else {
        console.log("9. Email sent:", data.id);
      }
    } catch (mailError) {
      console.error("Mail Error:", mailError);
    }

    return res.status(200).json({
      message: "Verification code resent",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
