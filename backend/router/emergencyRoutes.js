import express from "express";
import { isDoctorAuthenticated } from "../middlewares/auth.js";
import { assignEmergencyBed, flagEmergencyPatient, getBedAvailability } from "../controller/emergencyController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";


const router=express.Router();

// router.post("/flag",isDoctorAuthenticated,flagEmergencyPatient);
// router.post("/assign",isDoctorAuthenticated, assignEmergencyBed);

router.put("/flag",isAdminAuthenticated,flagEmergencyPatient);
router.put("/assign",isAdminAuthenticated, assignEmergencyBed);
router.get("/bed-availability",getBedAvailability);
router.get("/availability", isAdminAuthenticated, getBedAvailability);


export default router;
