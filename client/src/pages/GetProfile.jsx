import React from "react";
import { motion } from "framer-motion";
import { ShoppingBasket } from "lucide-react"; // you can change to any relevant icon...
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { usePolicyStore } from "../stores/usePolicyStore";
import { toast } from "react-hot-toast";
import { claimPolicy } from "../utils/handleClaimPolicy.js";

const GetProfile = () => {
  const { user, userProfile } = useUserStore();
  const { policies, loading } = usePolicyStore();
  const [claimStatus, setClaimStatus] = useState(false);
  const email = user?.email;
  if (email === undefined) return null;

  useEffect(() => {
    userProfile();
  }, [userProfile, email]);
  const dummyUser = {
    _id: "DUMMY",
    username: "DUMMY",
    email: "DUMMY",
    metamaskConnect: "DUMMY",
    documents: true,
    otp: "2387",
    isVerified: true,
    role: "admin",
    policies: [
      // Dummy policy data for display purposes
      { policyId: "policy1", units: 2 },
      { policyId: "policy2", units: 1 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const handleClaim = (
    policyId,
    units,
    returnRatio,
    userAddress,
    investment
  ) => {
    console.log(
      "Claim clicked",
      policyId,
      units,
      returnRatio,
      userAddress,
      investment
    );

    const policy = policies.find((p) => p.policyId === policyId);
    const totalReturn = investment * returnRatio * units; // total return to the user:-
    console.log(
      "Claim clicked - totol return : ",
      policyId,
      units,
      totalReturn,
      userAddress
    );
    try {
      const result = claimPolicy(policyId, units, totalReturn, userAddress);
      if (result) {
        console.log("Success in claiming the policy!");
        toast.success(result.message);
        setClaimStatus(true); // set the claim status to true....
      }
    } catch (error) {
      console.log("error in claiminh the policy...");
      toast.error(error.response.data.error || "Failed to claim policy");
    }
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
                    Policy ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Claim Benifit
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {profile.policies.map((p) => (
                  <tr key={p.policyId} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {p._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {p.units}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {p.units * p.returnRatio * p.investment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          handleClaim(
                            p.policyId,
                            p.units,
                            p.returnRatio,
                            profile.metamaskConnect,
                            p.investment
                          );
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                      >
                        Claim
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
