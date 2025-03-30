import { useEffect } from "react";
import { useState } from "react";
import { Minus, Plus , Loader} from "lucide-react";
import { usePolicyStore } from "../stores/usePolicyStore";
import { useUserStore } from "../stores/useUserStore";
import { Link,   useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { buyPolicy } from "../utils/handleBuyPolicy.js";
import { toast } from "react-hot-toast";


const CategoryPolicyPage = () => {
  const { fetchPolicyByCategory, policies, loading} =
    usePolicyStore();  
  const { user } = useUserStore();
  const { category } = useParams();
  const [units, setUnits] = useState(1);
  const [loadingBuy, setLoadingBuy] = useState(false); // New loading state
  console.log(units);
  const navigate = useNavigate(); // Define navigate inside the functional component
  const role = user?.role;

  useEffect(() => {
    fetchPolicyByCategory(category);
  }, [fetchPolicyByCategory]);

  const handleBuy = async (investment, policyID, PName, returnRatio) => {
    try { 
      const userWA = user.metamaskConnect; 
      const userId = user._id; // to save the policy status in the backend : 
      setLoadingBuy(true);
      const result = await buyPolicy(investment, units, userWA, userId, policyID, PName, returnRatio); // Simulate MetaMask transaction
	    console.log("Transaction success :", result) ;
      if(result.success){
        toast.success(result.message);
		    navigate("/purchase_success");
      } else{
        toast.error(result.message);
      }
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
          <Loader className="animate-spin text-emerald-400" size={50} />
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
                      {role === "user" && (
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
                      {role === "user" && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {/* Display the current units */}

                            <button
                              onClick={() => {
                                // Increase units when clicked
                                handleBuy(p.investment, p._id, p.name, p.returnRatio);
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
