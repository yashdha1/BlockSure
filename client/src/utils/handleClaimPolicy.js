import { ethers } from "ethers";
import axios from "../lib/axios.js";

const adminAddress = "0x2778F79eF8B8182ED85891cf46227479aDDA13D1"; 

export const claimPolicy = async (policyId, units, totalReturn, userAddress) => {
    if (!window.ethereum) {
      alert("MetaMask is required!");
      return; 
    }
    if(!policyId || !units || !totalReturn || !userAddress) {
        console.log("ALL FIELDS ARE NOT RECIEVED IN THE FUNCTION CALL OF CLAIMS policy.")
        return ;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const connectedAddress = await signer.getAddress();

    if (connectedAddress.toLowerCase() !== userAddress.toLowerCase()) {
        return { success: false, message: "Connected wallet doesn't match the logged-in user." };
    }


    // const tx = await signer.sendTransaction({
    //     to: adminAddress,
    //     value: ethers.parseEther(totalReturn.toString()), // Convert to correct format
    // });

    // await tx.wait();

    console.log("Transaction sent to admin successfully!");
    
    // Send claim request to backend
    console.log("req to backed!")
    const response = await axios.post("/claim", {
        policyId,
        units,
        totalReturn,
        userAddress
    });

    if(response.status !== 200) {
        return { success: false, message: "An unexpected error occurred. in saving the policy."};
      } 
      // Finally send the transaction....
      const tx = await signer.sendTransaction({
        to: userAddress , // Define in .env
        value: totalReturn 
      });
      await tx.wait();
    console.log("res to backed!")
    if (response.status === 200) {
        return { success: true, message: "Claim request sent to admin." };
    } else {
        return { success: false, message: "Failed to send claim request." };
    }
};