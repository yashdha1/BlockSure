import axios from "axios";


const axiosInstance = axios.create({
    // deployment will be diffrent : 
    baseURL: import.meta.mode === "development" ? "http://localhost:5000/api/v1" : "/api/v1", // Replace with your backend base URL
    withCredentials : true, // cookies will be send for everything 
});

console.log("mode", import.meta.mode); 
console.log("baseURL", axiosInstance.defaults.baseURL); 

export default axiosInstance ; 