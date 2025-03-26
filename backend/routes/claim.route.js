import express from "express";
import {
  createClaim, 
  getAllUserClaims
} from "../controllers/claim.controller.js";

import { protectedRoute  ,adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, createClaim);
router.get("/", protectedRoute, adminRoute, getAllUserClaims);

export default router;