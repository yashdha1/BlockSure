import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import policyRoutes from "./routes/policy.route.js";
import claimRoutes from "./routes/claim.route.js" ;


import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json({ limit: "10mb" })); // allows express formatting: JSON data.
app.use(cookieParser()); // allows express formatting: Cookies.

// routes 
app.use("/api/v1/auth", authRoutes); // authentication routes: 
app.use("/api/v1/policy", policyRoutes);  // policies ... complete the policies routes.... 
app.use("/api/v1/claim", claimRoutes); // after the policies are bought: 
// endpoints...
connectDB();
app.listen(PORT, () => {
  console.log("Server has started successfully!!! at http://localhost:" + PORT);
});

// PRODUCTION : enviorment: 
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/client/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
//   });
// }