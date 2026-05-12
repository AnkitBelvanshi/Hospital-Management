import express from "express";
import { 
    addMedicalRecord, 
    getAllMedicalRecords, 
    getMedicalRecordsByPatient, 
    updateMedicalRecord, 
    deleteMedicalRecord 
} from "../controller/medicalRecordsController.js";
import {isAdminAuthenticated,
        isDoctorAuthenticated,
} from "../middlewares/auth.js";

import {upload} from "../middlewares/multer.js";



const router = express.Router();

router.get("/all", isAdminAuthenticated, getAllMedicalRecords);
router.post("/add",isAdminAuthenticated, upload.single("file1"),addMedicalRecord);

router.get("/:patientId",isAdminAuthenticated, getMedicalRecordsByPatient);
router.put("/update/:id", isAdminAuthenticated,updateMedicalRecord);
router.delete("/delete/:id",isAdminAuthenticated, deleteMedicalRecord);


export default router;
