import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePolicyStore } from "../stores/usePolicyStore";
import axios from "axios"; // You forgot to import this
import { toast } from "react-hot-toast"; //

const ClaimsList = () => {
  const [ claims, setClaims ] = useState();
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        console.log("Requesting claims from API...");
        const response = await axios.get("/claims");
        setClaims(response.data.claims); // Or whatever your API returns
        console.log("Claims fetched successfully.", response.data.claims);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.error || "Failed to fetch claims");
      }
    };
    fetchClaims();
  }, [setClaims]);

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              User Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Policy ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Claim Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Documents Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {claims?.map((u) => (
            <tr key={u._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">{u.user}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{u.policy}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{u.claimAmount}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{u.documents}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ClaimsList;
