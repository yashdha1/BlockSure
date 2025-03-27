import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { toast } from "react-hot-toast" ; 
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const { OTPVal, loading, emailForOTP, user } = useUserStore();


  const handleVerify = () => {
    if (!otp) {
        return toast.error("Please enter OTP");
    }
    const emailToVerify = user?.email || emailForOTP; // Use fallback

    if (!emailToVerify) {
        return toast.error("Email not found - please restart verification");
    }
    
    OTPVal(otp, emailToVerify);
};

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 max-w-md mx-auto">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
        OTP Verification
      </h2>
      <p className="text-center text-gray-600 mb-4">
        Please enter the OTP sent to <span className="font-semibold">{user?.email || emailForOTP}</span>
      </p>
      
      <div className="mb-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
          placeholder="Enter 6-digit OTP"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
            focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-center"
          maxLength={6}
          inputMode="numeric"
          autoFocus
        />
      </div>
      
      <button
        onClick={handleVerify}
        disabled={loading || !otp || otp.length < 6}
        className="w-full flex justify-center py-2 px-4 border border-transparent 
          rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
          hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
          focus:ring-emerald-500 transition duration-150 ease-in-out 
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </span>
        ) : "Verify OTP"}
      </button>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Didn't receive OTP?{" "}
        <button 
          className="font-medium text-emerald-600 hover:text-emerald-500"
          onClick={() => toast.info("Resend OTP functionality to be implemented")}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;