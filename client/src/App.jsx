import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";
import VerifyOtp from "./pages/VerifyOtp";
import GetProfile from "./pages/GetProfile"; 
import CategoryPolicyPage from "./pages/CategoryPolicyPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";

import { useUserStore } from "./stores/useUserStore";

function App() { 
  
  const { user, checkAuth, checkingAuth } = useUserStore();
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden"> 
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
      </div>
    </div>
    <div className="relative z-50 pt-20">
    {/* navbar componenet */}
      <Navbar />  
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={!user ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/verify-otp"
          element={!user ? <VerifyOtp /> : <Navigate to="/" />}
        />
        <Route
          path="/getProfile"
          element={user ? <GetProfile /> : <Navigate to="/login" />}
        /> 
        <Route path="/category/:category" element={<CategoryPolicyPage />} />
        <Route  
          path="/admin-dashboard"
          element={
            user && user.role === "admin" ? (
              <AdminPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route 
             path = "/purchase_success"
             element={user  ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
        />
        
      </Routes>
    </div>
    <Toaster />
  </div>
  )
}

export default App
