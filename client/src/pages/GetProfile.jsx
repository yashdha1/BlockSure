import React from "react";
import { motion } from "framer-motion";
import { ShoppingBasket } from "lucide-react"; // you can change to any relevant icon

const GetProfile = ({ user }) => {
  // dummy data if no user prop is passed
  const dummyUser = {
    _id: "67e56dce3ecb451a403ea1df",
    username: "yash",
    email: "yashdhadod@gmail.com",
    metamaskConnect: "0x2778F79eF8B8182ED85891cf46227479aDDA13D1",
    documents: true,
    otp: "2387",
    isVerified: true,
    role: "admin",
    policies: [
      // Dummy policy data for display purposes
      { policyId: "policy1", name: "Life Cover", units: 2 },
      { policyId: "policy2", name: "Health Cover", units: 1 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const profile = user || dummyUser;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900 text-gray-100">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-8 text-emerald-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          User Profile
        </motion.h1>

        {/* User Details Card */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">{profile.username}</h2>
          <p className="mb-2">
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Metamask Account:</span>{" "}
            {profile.metamaskConnect}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Verified:</span>{" "}
            {profile.isVerified ? "Yes" : "No"}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Role:</span> {profile.role}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Account Created:</span>{" "}
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Policies Section */}
        <motion.div
          className="bg-gray-800 p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <ShoppingBasket className="h-6 w-6 mr-2 text-emerald-400" />
            <h2 className="text-2xl font-bold">Your Policies</h2>
          </div>

          {profile.policies && profile.policies.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Policy Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {profile.policies.map((p) => (
                  <tr key={p.policyId} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {p.units}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => alert(`Claiming policy ${p.policyId}`)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                      >
                        CLAIM
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">No policies found.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GetProfile;
