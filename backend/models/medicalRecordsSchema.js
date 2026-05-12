import mongoose from "mongoose";
import validator from "validator";

const medicalRecordSchema = new mongoose.Schema({
    
    firstName:{
        type: String,
        required: true,
        minLength: [3,"First Name Must Contain At Least 3 Characters!"]
    },
    lastName:{
        type: String,
        required: true,
        minLength: [3,"Last Name Must Contain At Least 3 Characters!"]
    },
    email:{
            type: String,
            required: true,
            validate: [validator.isEmail, "Please Provide A Valid Email!"]
    },
    patientId: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Patient Id Is Required!"],
    },
    recordType: {
        type: String,
        enum: ["history", "lab_result", "xray", "prescription", "doctor_notes"],
        required: true
    },
    recordData: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const MedicalRecord = mongoose.model("MedicalRecord",medicalRecordSchema);
export default MedicalRecord;