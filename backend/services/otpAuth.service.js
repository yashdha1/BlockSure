import nodemailer from "nodemailer"; 
import dotenv from "dotenv";
dotenv.config(); 

// OTP : VERIFICATION FUNCTIONS :->   
export const generateOTP = () => Math.floor(1000  + Math.random() * 9000 ).toString();