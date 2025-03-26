import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const policySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    investment : {
      type: Number,
      required: true,
      min: 0.1
    },
    category: {
      type: String,
      required: true,
    },
    returnRatio: {
      type: Number,
      required: true,
      min: 1.1 
    }
  },
  {timestamps: true}
);

const Policy = mongoose.model("Policy", policySchema); 
export default  Policy ; 