import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import { redis } from "../lib/redis.js";
import { ethers } from "ethers";
import { generateOTP } from "../services/otpAuth.service.js";

import dotenv from "dotenv";
dotenv.config();

// otp verificationn transporter : 
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Explicit hostname
  port: 465, // SSL (or 587 for TLS)
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_PASS,
  },
});
// Endpoints :
export const signup = async (req, res) => {
  try { 
    const { username, email, password, metamaskConnect, documents} = req.body;
    if (!username || !email || !password || !metamaskConnect || !documents )
       return res.status(400).send("All fields are required.");

    const userMail = await User.findOne({ email }); // check if user already exists!!
    if (userMail) {
      return res.status(400).send("User Email already exists!");
    }
    const otp = generateOTP() ;
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) ;

    const newUser = await User.create({
      username,
      email,
      password,
      metamaskConnect,
      documents,
      otp,
      otpExpires: otpExpiry,
      isVerified: true, // Temporary email verification: 
    });

    const { accessToken, refreshToken } = generateTokens(newUser._id);
    await storeTokens(newUser._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      user: newUser,
      message: " User created successfully ",
    });
  } catch (error) {
    console.log("Error in SIGNUP CONTROLLER");
    return res.status(500).json({ error: error.message});
  }
};

// afterr this page redirect to the verification page of the OTP : 
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body; // get mail ad otp from the BODY : 
    if (!email || !otp) return res.status(400).send("Email and OTP are required.");
    const user = await User.findOne({ email }); // fin the email in the DB 
    if (!user) return res.status(400).send("User not found.");

    // Check if OTP is correct and not expired
    if (user.otp != otp ) {
      return res.status(400).send("Invalid or expired OTP.");
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.otp = null; // unsave the OTP 
    await user.save();

    // Generate authentication tokens
    // const { accessToken, refreshToken } = generateTokens(user._id);
    // await storeTokens(user._id, refreshToken);
    // setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Email verified successfully. Signup complete!",
      user,
    });
  } catch (error) {
    console.error("Error in OTP Verification", error);
    return res.status(500).json({ error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("All fields are required.");
    const user = await User.findOne({ email }); // find user in the DATABASE :

    if(user.isVerified === false) {
       return res.status(401).json({ error: "User is not verified | Complete OTP VERIFICATION FIRST." }); 
    }
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id); // after user is created :
      await storeTokens(user._id, refreshToken); // storing Tokens in redis Database :
      console.log(" Setting Cookies: ", { accessToken, refreshToken });
      setCookies(res, accessToken, refreshToken); // setup cookies So we can access it later...
      console.log(" Setting Cookies: ", { accessToken, refreshToken });

      res.json({ user, message: "User logged in successfully" }); // send user as the respose:
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Error in LOGIN CONTROLLER");
    console.log("Error in LOGIN CONTROLLER", error);
    return res.status(500).json({ error: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // collect this token from cookies.
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      await redis.del(`Refresh Token: ${decoded.userId}`); // delete the current instance for this shit...
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error in logout CONTROLLER");
    res.status(500).json({ error: error.message });
  }
};
export const refreshTokens = async (req, res) => {
  // refreshToken : refreshes the access token so that the user can access the account, even after the timeout.
  // or the previous cookie has expiered :
  try {
    const refreshToken = req.cookies.refreshToken; // Get the refresh token from cookies
    if (!refreshToken) {
      return res.json({ message: "User logged out successfully" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // debugg :
    console.log("Refresh Token from Cookie:", refreshToken);
    const getStoredToken = await redis.get(`Refresh Token: ${decoded.userId}`);
    console.log("Stored Refresh Token in Redis:", getStoredToken);

    if (getStoredToken !== refreshToken) {
      console.log("Token mismatch! Unauthorized access.");
      return res
        .status(401)
        .json({ error: " Unauthorized: Invalid refresh token... " });
    }

    // else generate the new refresh TOKEN...
    // Generate a new access token
    const refreshedAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIREIN }
    );
    // Set the new access token in cookies
    res.cookie("accessToken", refreshedAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: "Token refreshed successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server ERROR. LOGOUT AND TRY AGAIN." });
  }
};
export const getProfile = async (req, res) => {
  try { 
    const { email } = req.query; // only the particular user can accesss this shit... 
    if (!email)
      return res.status(400).send("Email not provided!");
    const user = await User.findOne({ email }); // find user in the DATABASE :

    if(user.isVerified === false) {
       return res.status(401).json({ error: "User is not verified | Complete OTP VERIFICATION FIRST." }); 
    }
    console.log(user); 
    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error in getProfile CONTROLLER");
    res.status(500).json({ error: error.message });
  }
};

// for admin gets all the users from the database:
export const getAllUsers = async (req, res) => {
  try {
    const user = await User.find({}); // find user in the DATABASE : 
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}; 

// Helper Functions :
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIREIN,
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIREIN,
  });

  return { accessToken, refreshToken };
};
const storeTokens = async (userId, refreshToken) => {
  await redis.set(
    `Refresh Token: ${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 // 7 days
  );
};
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //  Only secure in production
    sameSite: "lax", //  Allows cookies in cross-origin requests
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //  Only secure in production
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  console.log("fuck Cookies Set:", {
    accessToken,
    refreshToken,
  });
};