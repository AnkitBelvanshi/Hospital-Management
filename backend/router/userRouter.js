import express from "express";
import {getAdminDetails, getAllPatients,addNewAdmin, addNewDoctor, getAllDoctors, getUserDetails, login, logoutAdmin, logoutPatient, patientRegister } from "../controller/userController.js";
import {
    isAdminAuthenticated, 
    isPatientAuthenticated,
} from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";


const router=express.Router();


router.post("/patient/register",patientRegister);
router.post("/login",login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/patient/me",isPatientAuthenticated, getUserDetails);
router.get("/admin/logout",isAdminAuthenticated, logoutAdmin);
router.get("/patient/logout",isPatientAuthenticated, logoutPatient);
router.get("/admin/me", isAdminAuthenticated, getAdminDetails);
router.get("/patients", isAdminAuthenticated, getAllPatients);
router.get("/medical-records", isAdminAuthenticated, getAllPatients);

router.post(
    "/doctor/addnew",
    isAdminAuthenticated,
    upload.single("docAvatar"),  // ✅ attach multer
    addNewDoctor
  );



export default router;