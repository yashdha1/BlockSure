import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User who is claiming
      required: true,
    },
    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy", // Reference to the Policy being claimed
      required: true,
    },
    claimAmount: {
      type: Number,
      required: true,
    },
    claimStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    document: {
      type: Boolean, // True if user has uploaded the required
      required: true, 
      default: false
    }, 
    claimDate: {
      type: Date,
      default: Date.now,
    },
    transactionHash: {
      type: String,  // TransactionHash from Ethereum transaction when claim is processed
    },
  },
  { timestamps: true }
);

const Claim = mongoose.model("Claim", claimSchema);
export default Claim;
