import express from "express";
import { getAllBeds, toggleBedAssignment } from "../controller/bedController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", isAdminAuthenticated, getAllBeds);
router.put("/toggle", isAdminAuthenticated, toggleBedAssignment);

export default router;
