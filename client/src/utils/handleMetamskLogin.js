import { ethers } from "ethers";

export const handleMetaMaskLogin = async () => {
  if (!window.ethereum) {
    alert("MetaMask is not installed. Please install it.");
    return;
  }

  try {
    // Request user's Ethereum account
    console.log("A")
    const provider = new ethers.BrowserProvider(window.ethereum); // ethers.js v6+
    console.log(provider)
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("B")
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress(); // Get user's address
    console.log("C")
    // Generate a unique message
    const message = `Sign this message to verify your wallet: ${Date.now()}`;
    const signature = await signer.signMessage(message); // User signs the message
    console.log("Metamask authentication successful"); 
    return { userAddress, signature, message }; // Return required authentication details
  } catch (error) {
    console.error("MetaMask authentication failed:", error);
    alert("Authentication failed! Please try again.");
  }
};