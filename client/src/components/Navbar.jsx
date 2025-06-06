import React from "react";
import { Bitcoin } from "lucide-react";
import { UserPlus, LogOut, LogIn, Lock , CircleUser} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore"; 

const Navbar = () => {
  // flags that determin the state of the user, authentication .
  const { user, logout, userProfile } = useUserStore();

  const admin = user?.role === "admin";
  
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to="/"
            className="text-4xl font-bold text-emerald-400 items-center space-x-2 flex"
          >
            <Bitcoin size={42} />
            BlockSure
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-gray-300 hover:text-emerald-400 transition duration-300
					 ease-in-out"
            >
              Home
            </Link>

            {admin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center"
                to={"/admin-dashboard"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {!admin && (
               <Link
               to={"/getProfile"}
               className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
               rounded-md flex items-center transition duration-300 ease-in-out"
             >
               <CircleUser size={22} className="mr-2"/>
                Profile
             </Link>
            )}

            {/* if logged in user provide a logout functionality  AND a link to the User dashboard*/}
            {user ? (
              <>
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						               rounded-md flex items-center transition duration-300 ease-in-out"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline ml-2">Log Out</span>
                </button>
              </>
            ) : (
              <>
                {/* else display the login and signup buttons */}
                <Link
                  to={"/signup"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Log In
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
