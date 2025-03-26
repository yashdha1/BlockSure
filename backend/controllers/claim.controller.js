import User from "../model/user.model.js"; 
import Claim from "../model/claim.model.js";
import Policy from "../model/policy.model.js";

import nodemailer from "nodemailer";

import { redis } from "../lib/redis.js";
import { ethers } from "ethers";
// import { generateOTP } from "../services/otpAuth.service.js";

import dotenv from "dotenv";
dotenv.config();

// after the user clicks the claim button :->  
// the user that wants to claim the policy.
// getting the policyID from the user.policies:
export const createClaim = async (req, res) => {
    try { 
      const { policyId, userId , document } = req.body;
      // Validate inputs
      if (!policyId || !userId) {
        return res.status(400).json({
          success: false,
          message: "policyId and userId are required",
        });
      }
      if(!document){
        return res.status(400).json({
          success: false,
          message: "document Verification is Nessacary.",
        }); 
      }
      // Find the user
      const user = await User.findById(userId);
      if (!user) { return res.status(404).json({ success: false, message: "User not found" }); }
      // Find the policy
      const policy = await Policy.findById(policyId);
      if (!policy) { return res.status(404).json({ success: false, message: "Policy not found" });
      }
      // Find the user's purchased policy details : 
      const userPolicy = user.policies.find(
        (p) => p.policyId.toString() === policyId
      );
  
      if (!userPolicy) {
        return res.status(400).json({
          success: false,
          message: "User has not purchased this policy",
        });
      }
  
      // Calculate claim amount
      const claimAmount = userPolicy.units * policy.investment * policy.returnRatio;
  
      // Create claim 
      const newClaim = await Claim.create({
        user: userId,
        policy: policyId,
        claimAmount,
        document,
        claimStatus: "pending", // Default status : 
      });
  
      return res.status(201).json({
        success: true,
        message: "Claim request submitted successfully",
        claim: newClaim,
      });
    } catch (error) {
      console.error("Error in creating claim:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
};
// FOR THE ADMIN GETS ALL THE CLAIM REQUEST CURRENTLY:  
export const getAllUserClaims = async (req, res) => {
    try {
        const claims = await Claim.find({}); 
        // return all the current claims: 
        return res.status(200).json({ claims });
    } catch (error) {
        console.log("Error in getAllClaims CONTROLLER...");
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};