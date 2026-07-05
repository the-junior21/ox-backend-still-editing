import bcrypt from "bcryptjs";
import express from "express";
import transporter from "../utils/mail.js";
import User from "../models/User.js";

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
  console.log("7. SMTP verified");
  console.log("8. Sending email");

await transporter.verify()
console.log("gmailSMTP connected");
  await transporter.sendMail({
    from: '"OX" <no-reply@ox.com>',
    to: "houbercarl@gmail.com",//user.email,//looo bsxx jtue bgwf

    subject: "Verify your email",
    html: `
      <h2>Welcome to OX!</h2>

      <p>Your verification code is:</p>

      <h1>${verificationCode}</h1>

      <p>This code expires in 10 minutes.</p>
    `,
  });
  console.log("9. Email sent");


  console.log("Email sent successfully");
  
} catch (mailError) {
  console.error("Mail Error:", mailError);
}

    res.status(201).json({
      message: "Verification code sent",
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000)
      return res.status(400).json({ message: "Numebr exists" });

    res.status(500).json({ message: "Server error" });
  }
});

export default router;
