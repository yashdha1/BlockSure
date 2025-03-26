import Policy from "../model/policy.model.js";
import mongoose from "mongoose";
import User from "../model/user.model.js";

// admins :
export const getAllPolicy = async (req, res) => {
  // for the ADMIN DASHBOARD:
  try {
    const policies = await Policy.find({}); //  find all the products in the Object...
    res.json({ policies });
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
    // Validate investment & returnRatio are numbers
    if (typeof investment !== "number" || typeof returnRatio !== "number") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Investment and returnRatio must be numbers.",
        });
    }
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
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};
export const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
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
    return res
      .status(500)
      .json({
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
      return res
        .status(404)
        .json({
          success: false,
          message: "No policies found for this category",
        });
    }
    return res.status(200).json({ success: true, policies });
  } catch (error) {
    console.error("Error in getPolicyByCategory:", error.message);
    return res
      .status(500)
      .json({
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
      return res.status(404).json({ success: false, message: "Policy not found" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Calculate total cost (assuming investment is per unit)
    const totalCost = policy.investment * units ;

    // TODO: INTEGRATE METAMASK CONNECTIONS AND THE SHITS TO DO :
    // Here, you'd integrate Ethereum transaction logic :- 
    // - Check if user has enough balance
    // - Transfer ETH to the admin account
    // - Confirm the transaction before proceeding

    // For now, we'll assume the transaction is successful and update the user's policies
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