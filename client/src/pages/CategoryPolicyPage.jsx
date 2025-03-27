import { useEffect } from "react";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { usePolicyStore } from "../stores/usePolicyStore";
import { useUserStore } from "../stores/useUserStore";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryPolicyPage = () => {
  const { fetchPolicyByCategory, policies, loading, BuyPolicyStore } =
    usePolicyStore();  
  const { user } = useUserStore();
  const { category } = useParams();
  const [units, setUnits] = useState(1);
  const [loadingBuy, setLoadingBuy] = useState(false); // New loading state
  console.log(units);

  useEffect(() => {
    fetchPolicyByCategory(category);
  }, [fetchPolicyByCategory]);

  const handleBuy = async (policyId) => {
    try {
      setLoadingBuy(true); // Set loading state when Buy button is clicked
      const result = await BuyPolicyStore(policyId, units, user); // Simulate MetaMask transaction
	  if(result) 
		Navigate("/success-page"); // Redirect to success page
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setLoadingBuy(false);
    }
  };

  return (
    <div className="min-h-screen">
      {loadingBuy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 animate-spin"></div>
        </div>
      )}

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>

        <motion.div
          className="grid grid-cols-1  gap-6 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* if the policies are zero in this category.... */}
          {policies?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No Policy found
            </h2>
          )}

          {/* if their are policies in the category then display them */}
          {policies?.length !== 0 && (
            <>
              <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
                Policies in {category} Category
              </h2>
              <table className=" min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Policy
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Minimum Investment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Returns
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      {/* <Button
                        onClick={BuyPolicy}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Buy
                      </Button> */}
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {policies?.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {p.name}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          ETH {p.investment}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          MUL {p.returnRatio}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {p.category}
                        </div>
                      </td>
                      {user && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Minus
                            size={18}
                            className="inline-block mr-1 bg-slate-100 text-black "
                            onClick={() => setUnits(units - 1)}
                          />
                          <span className="mr-4 text-lg font-semibold text-White-700">
                            {units}
                          </span>
                          <Plus
                            size={18}
                            className="inline-block mr-1 bg-slate-100 text-black"
                            onClick={() => setUnits(units + 1)}
                          />
                        </td>
                      )}
                      {user && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {/* Display the current units */}

                            <button
                              onClick={() => {
                                // Increase units when clicked
                                handleBuy(p._id);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-l py-3 px-5 
                                        rounded-md flex items-center transition duration-300 ease-in-out"
                            >
                              Buy
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default CategoryPolicyPage;
