const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  policy: { type: mongoose.Schema.Types.ObjectId, ref: "Policy" },
  claim: { type: mongoose.Schema.Types.ObjectId, ref: "Claim" },
  amount: { type: Number, required: true },
  transactionHash: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  timestamp: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
