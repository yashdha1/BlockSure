// maintains a Global store for all the User related activities :-  

import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";

export const useUserStore = create((set, get) => ({
    user: null, 
    checkingAuth: true,
    loading: false, 
    verified : false,
    emailForOTP: "", // Store email for OTP verification

    signup : async ({username, email , password, confirmPassword, metamaskConnect , documents }) => {
        set({loading: true}); // start thy loading.... 
        if(password !== confirmPassword){
            set({loading: false}); // stop the Loading and return the error:  
            return toast.error("Passwords do not match");
        }
        if(!metamaskConnect){
            set({loading: false}); // stop the Loading and return the error:  
            return toast.error("Please connect with Metamask to continue."); 
        }
        try {
            // send req to backend :
            const res = await axios.post("/auth/signup", {username, email, password,  metamaskConnect, documents}) ;
            console.log(res.data.user);
            set({
                user: res.data.user,  // Use res.data.user instead
                loading: false,
                emailForOTP: email, 
                verified: true // TEMPORARY AUTOMATIC VERIFICATION OF THE USER: wITHOUT OTP VERIFICATION....
            });
            toast.success("Signed Up succesfully....") ;
            // Navigate("/verify-otp"); // window.location.href = "/verify-otp"; // Redirect to OTP Verification Page 
        } catch (error) {
            set({loading: false}); // stop the Loading and return the error:
            console.log(error);
            toast.error(error.response.data.error);
        }
    },
    OTPVal: async (otp, email) => {
        set({ loading: true });
        try {
           const emailToVerify = user.email || get().emailForOTP ;

           if (!emailToVerify || !otp) {
               set({ loading: false });
               return toast.error("Email and OTP are required");
           }
           const res = await axios.post("/auth/verifyOTP", { 
               email: emailToVerify, 
               otp
           });

          if (!res.data) {
            set({ loading: false });
            toast.error("No response data received");
            return;
          }
           set({ 
                user: res.data.user || get().user,
                loading: false,
                verified: true,
                emailForOTP: "" // Clear after successful verification
            });

          toast.success("OTP Verified Successfully");
          window.location.href = "/";
        } catch (error) {
          console.error('Error in OTP Verification:', error);
          set({ loading: false });
          const errorMessage = error.response?.data?.error || 
                              error.message || 
                              "OTP verification failed";
          toast.error(errorMessage);
        }        
    },
    login : async ({email, password}) => {
        set({loading: true}); // start thy loading.... 
        try {
            const res = await axios.post("/auth/login", { email, password }); 
            console.log(res)
            set({user: res.data.user , loading: false}); // finish Loading 
            console.log(res);
            toast.success("Logged in, Successfully");
        } catch (error) {
            set({loading: false}); // stop the Loading and return the error:
            console.log(error); 
            toast.error(error.response.data.error);
        }
    },
    checkAuth: async () => {
        set({checkingAuth: true});
        try {
            const res = await axios.get("/auth/profile");
            set({user: res.data.user , checkingAuth: false});
        } catch (error) {
          set({ checkingAuth: false , user: null});   
        }
    }, 
    logout: async () => {
        try {
            await axios.post("/auth/logout") ;
            set({user: null}); 
            toast.success("Logged Out Successfully");
        } catch (error) {
            toast.error(error.response.data.error || "Error Occured Durinng LOGOUT.")
        }
    },
    // userProfile : async({ email })=>{
    //     set({loading: true}); // start thy loading....
    //     if(!email){
    //         set({loading: false}); 
    //         return res.status(400).send("Email is required.");
    //     }
    //     try {
    //         const responce = await axios.get("/auth/profile", { email });
    //         if(!responce){
    //             set({loading: false});
    //             return toast.error("No response data received") ;
    //         }
    //         set({ user: responce.data.user, loading: false }) ;
    //         toast.success("User Profile fetched successfully");
    //     } catch (error) {
    //         console.error("Error in fetching User Profile", error);
    //         set({loading: false});
    //         toast.error(error.response?.data?.error || error.message || "Error in fetching User Profile");   
    //     }
    // },
    userProfile : async ({ email }) => {
        set({ loading: true }); 
        if (!email) {
            set({ loading: false }); 
            toast.error("Email is required.");
            return;
        }
        try {
            const response = await axios.get(`/auth/profile?email=${email}`);
            if (!response.data) {
                set({ loading: false });
                return toast.error("-- NO DATA ON USER --");
            }
            set({ user: response.data.user, loading: false });
            toast.success("User Profile fetched successfully");
        } catch (error) {
            console.error("Error fetching User Profile:", error);
            set({ loading: false });
            toast.error(error.response?.data?.error || error.message || "Error fetching profile");
        }
    },
    
}));


let refreshPromise = null;
axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);