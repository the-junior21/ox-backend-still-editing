import express from "express";
import { resend } from "../utils/resend.js"; // adjust to your setup
import User from "../models/User.js";

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    const passwordResetCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const passwordResetCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.passwordResetCode = passwordResetCode;
    user.passwordResetCodeExpires = passwordResetCodeExpires;

    await user.save();

    const { data, error } = await resend.emails.send({
      from: "OX <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset your OX password",
      html: `
        <h2>Reset your password</h2>

        <p>Your password reset code is:</p>

        <h1>${passwordResetCode}</h1>

        <p>This code expires in 10 minutes.</p>
      `,
    });

    if (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to send email",
      });
    }

    return res.status(200).json({
      message: "Reset code sent",
      userId: user._id.toString(),
      email: user.email,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/verify-reset-code", async (req, res) => {
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

    if (user.passwordResetCode !== code) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }

    if (new Date() > user.passwordResetCodeExpires) {
      return res.status(400).json({
        message: "Verification code expired",
      });
    }

    return res.status(200).json({
      message: "Code verified",
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/resend-code-password", async (req, res) => {
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

    const passwordResetCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.passwordResetCode = passwordResetCode;
    user.passwordResetCodeExpires = passwordResetCodeExpires;

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
      <h1>${passwordResetCode}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
      });

      if (error) {
        console.error("Resend error:", error);

        return res.status(500).json({
          message: "Failed to send verification email",
        });
      }

      console.log("9. Email sent:", data.id);
    } catch (mailError) {
      console.error("Mail Error:", mailError);
    }
    await user.save();

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