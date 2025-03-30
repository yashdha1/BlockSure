import dotenv from "dotenv";
import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const usePolicyStore = create((set) => ({
  policies: [],
  users: [],
  loading: false,
  setPolicy: (policies) => set({ policy }),

  createPolicy: async (policyData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/policy", policyData, {
        withCredentials: true,
      });
      console.log(policyData);
      console.log("request to API");

      set((prevState) => ({
        products: [...prevState.policies, res.data],
        loading: false,
      }));

      toast.success("policy Created Successfully!");
    } catch (error) {
      toast.error("Server Error!");
      set({ loading: false });
      console.log(error);
    }
  },
  fetchAllPolicies: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/policy");
      set({ policies: response.data.policies, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch policies", loading: false });
      toast.error(error.response.data.error || "Failed to fetch policies");
    }
  },
  deletePolicy: async (policyId) => {
    set({ loading: true });
    try {
      await axios.delete(`/policy/${policyId}`);
      set((prevPolicies) => ({
        policies: prevPolicies.policies.filter((p) => p._id !== policyId),
        loading: false,
      }));
      toast.success("Policy deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete !");
    }
  },
  fetchPolicyByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/policy/category/${category}`);
      console.log("Category Policy Store:");
      console.log(response);
      set({ policies: response.data.policies, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to fetch policies");
    }
  },
  // FETCH : users
  fetchAllUsers: async () => {
    set({ loading: true });
    try {
      console.log("request to API");
      const response = await axios.get("/policy/users");
      set({ users: response.data.user, loading: false });
      console.log("API responded...");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to fetch users");
    }
  },
  BuyPolicyStore: async (policyId, units, user) => {
    set({ loading: true });
    try {
      console.log("Buy Store Called ... ")
      console.log(axios); 
      const response = await axios.post("/policy/profile", {
        policyId,
        units,
        user,
      });
      console.log("Buy Store Called RESPONCE:-->")
      console.log(response)
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to buy policy");
    }
  },
}));