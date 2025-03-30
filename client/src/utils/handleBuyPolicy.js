import { ethers } from "ethers";
import axios from "../lib/axios.js";
// import dotenv from "dotenv"; 
// dotenv.config();

const ADMIN_WALLET_ADDRESS = "0x2778F79eF8B8182ED85891cf46227479aDDA13D1"; 

export const buyPolicy = async ( investment, units, userAddress , userId , policyId, PName, returnRatio) => {
  if (!window.ethereum) {
    alert("MetaMask is required!");
    return;
  }
  try { 
    
    const totalCost = investment * units;
    // Validate input
    if (!policyId || !units || !userId ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required...",
      });
    }

    if (totalCost <= 0) {
      return res.status(400).json({
        success: false,
        message: "Units must be greater than zero",
      });
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const connectedAddress = await signer.getAddress(); 

    if (connectedAddress.toLowerCase() !== userAddress.toLowerCase()) {
      return { success: false, message: "Connected wallet doesn't match the logged-in user." };
    }
    const tc = ethers.parseEther(totalCost.toString());
    // Call backend API to save the policy  
    const response = await axios.post("/policy/save_policy", {
      policyId,
      units,
      userId,
      PName,
      returnRatio
    });

    if(response.status !== 200) {
      return { success: false, message: "An unexpected error occurred. in saving the policy." };
    } 
    // Finally send the transaction.... 
    const tx = await signer.sendTransaction({
      to: ADMIN_WALLET_ADDRESS, // Define in .env
      value: tc,
    }); 
    await tx.wait(); 
    return { success: true, message: "Purchase successful", txHash: tx.hash };
  } catch (error) {
    if (error.code === 4001) {
      return { success: false, message: "Transaction was cancelled by the user." };
    }
    console.error("Error purchasing policy:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
};