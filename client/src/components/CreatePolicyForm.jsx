import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { usePolicyStore } from "../stores/usePolicyStore";

const categories = ["Health", "Cancer", "Life", "Vehical", "Accidental", "Mahila"];

const CreatePolicyForm = () => {
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    description: "",
    investment: "",
    category: "",
    returnRatio: "",
  });

  const { createPolicy, loading } = usePolicyStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      console.log("Brand New Policy Body: ", newPolicy); 
      await createPolicy(newPolicy);
      // reset
      setNewPolicy({
        name: "",
        description: "",
        investment: "",
        category: "",
        returnRatio: "",
      }); // for next creation : 
    } catch {
      console.log("error creating a policy");
    }
  };
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create A New Policy
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Policy Name
          </label>

          <input
            type="text"
            id="name"
            name="name"
            value={newPolicy.name}
            placeholder="Jeevan Anand"
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, name: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
           px-3 text-white focus:outline-none focus:ring-2
          focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newPolicy.description}
            placeholder="A policy that provides both savings and protection..."
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, description: e.target.value })
            }
            rows="3"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
           py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
           focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="investment"
            className="block text-sm font-medium text-gray-300"
          >
            Min Investment
          </label>
          <input
            type="number"
            id="investment"
            name="investment"
            value={newPolicy.investment}
            placeholder="MIN ETH 0.1"
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, investment: e.target.value })
            }
            step="0.01"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
          py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
           focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Policy Category
          </label>
          <select
            id="category"
            name="category"
            value={newPolicy.category}
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, category: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
           shadow-sm py-2 px-3 text-white focus:outline-none 
           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="returnRatio"
            className="block text-sm font-medium text-gray-300"
          >
            Return Ratio
          </label>
          <input
            type="number"
            id="returnRatio"
            name="returnRatio"
            value={newPolicy.returnRatio}
            placeholder="MIN 1.1"
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, returnRatio: e.target.value })
            }
            step="0.01"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
          py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
           focus:border-emerald-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
        shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreatePolicyForm;
