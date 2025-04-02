import Policy from "../model/policy.model.js";
import mongoose from "mongoose";
import User from "../model/user.model.js";
import dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();

// admins :
export const getAllPolicy = async (req, res) => {
  // for the ADMIN DASHBOARD:
  try {
    console.log("getPolicy CONTROLLER");
    const policies = await Policy.find({}); //  find all the products in the Object...
    console.log("policies :", policies);
    res.json({ policies }); // return the products in the JSON format...
  } catch (error) {
    console.log("Error in getPolicy CONTROLLER");
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
export const createPolicy = async (req, res) => {
  try {
    const { name, description, category, investment, returnRatio } = req.body;
    // Validate required fields
    if (
      !name ||
      !description ||
      !category ||
      investment == null ||
      returnRatio == null
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    console.log("investment :", investment);
    console.log("returnRatio :", returnRatio);

    // Validate investment & returnRatio are numbers

    const newPolicy = await Policy.create({
      name,
      investment,
      description,
      category,
      returnRatio,
    });
    return res.status(201).json({
      success: true,
      policy: newPolicy,
      message: "Policy created successfully",
    });
  } catch (error) {
    console.error("Error in policy creation:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params; // get the current policy ID :
    // Check if the ID is a valid MongoDB ObjectId
    console.log("id :", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid policy ID format" });
    }
    const deletedPolicy = await Policy.findByIdAndDelete(id);
    if (!deletedPolicy) {
      return res
        .status(404)
        .json({ success: false, message: "Policy not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Policy deleted successfully" });
  } catch (error) {
    console.error("Error in policy deletion:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// general everyone : should be able to get this :-
export const getPolicyByCategory = async (req, res) => {
  try {
    const { category } = req.params; // Use URL params instead of body
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });
    }
    const policies = await Policy.find({ category });
    if (policies.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No policies found for this category",
      });
    }
    return res.status(200).json({ success: true, policies });
  } catch (error) {
    console.error("Error in getPolicyByCategory:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// for users :
export const getAllUserPolicy = async (req, res) => {
  try {
    // for users profile :
    const { userId } = req.params; // Use URL params instead of body
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "could not find user !" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "could not find user 2 !" });
    }
    return res.status(200).json({
      success: true,
      policies: user.policies,
    });
  } catch (error) {
    console.error("Error in fetching user policies:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// Buying policy controller to transfer funds: 
export const buyPolicyUser = async (req, res) => {
  try {
    const { policyId, units, userId } = req.body;

    // Validate input
    if (!policyId || !units || !userId) {
      return res.status(400).json({
        success: false,
        message: "policyId, units, and userId are required",
      });
    }

    if (units <= 0) {
      return res.status(400).json({
        success: false,
        message: "Units must be greater than zero",
      });
    }

    // Check if policy exists
    const policy = await Policy.findById(policyId);
    if (!policy) {
      return res
        .status(404)
        .json({ success: false, message: "Policy not found" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Calculate total cost (assuming investment is per unit)
    const totalCost = policy.investment * units;

    // commence the transaction : 
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner(); // Get the connected user's signer
    const userAddress = await signer.getAddress(); // Get user's wallet address

    console.log(`Buying Policy: ${policyId}, Cost: ${totalCost} ETH`);
    
    // Send ETH from user to admin
    const tx = await signer.sendTransaction({
      to: process.env.ADMIN_WALLET_ADDRESS, // Replace with your admin ETH wallet
      value: ethers.utils.parseEther(totalCost.toString()), // Convert to Wei
    });

    console.log("Transaction Sent:", tx.hash); 
    await tx.wait();

    user.policies.push({ policyId, units });
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Policy purchased successfully",
      userPolicies: user.policies,
    });
  } catch (error) {
    console.error("Error in buying policy:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const savePolicyBoughtUser = async (req, res) => {
  try {
    const { investment ,policyId, units, userId, PName, returnRatio } = req.body ;
    if ( !investment || !policyId || !userId || !units || !returnRatio || !PName) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    const existingPolicy = user.policies.find((p) => p.policyId.toString() === policyId);
    if (existingPolicy) { 
      existingPolicy.units += units;
    } else {
      console.log("Pushing policy:", {
        investment,
        policyId,
        PName,
        units,
        returnRatio
      });
      user.policies.push({ investment ,policyId , PName , units , returnRatio });
    }
    await user.save();
    return res.status(200).json({ success: true, message: "Policy saved successfully", userPolicies: user.policies });
  } catch (error) {
    console.error("Error saving policy:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};