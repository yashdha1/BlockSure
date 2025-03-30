import express from "express";
import {
    getAllPolicy,
    getPolicyByCategory,
    createPolicy,
    deletePolicy,
    getAllUserPolicy,
    buyPolicyUser,
    savePolicyBoughtUser
} from "../controllers/policy.controller.js";
import { getAllUsers } from "../controllers/auth.controller.js"; 

import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route should be protected and only be accesible via ADMIN...
router.get("/", protectedRoute, adminRoute, getAllPolicy); // get all the policies...  only for the admin...
router.post("/", protectedRoute, adminRoute, createPolicy);
router.delete("/:id", protectedRoute, adminRoute, deletePolicy);

// get all the users : 
router.get("/users", protectedRoute, adminRoute, getAllUsers);

// get all the policies by the category :  
router.get("/category/:category", getPolicyByCategory); // get all the policies by category...

// in category section the policies will be listed if buyed is clicked 
router.post("/profile", protectedRoute, buyPolicyUser);

// user only routes :- for PROFILE DASHBOARD 
router.get("/profile",protectedRoute , getAllUserPolicy);

// savee the policies bought by the user...
// /api/v1/policy/save_policy...
router.post("/save_policy", protectedRoute, savePolicyBoughtUser);

export default router;