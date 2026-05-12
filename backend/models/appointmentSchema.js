import mongoose from "mongoose";
import { Mongoose } from "mongoose";
import validator from "validator";


const appointmentSchema = new mongoose.Schema({
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
    phone:{
        type: String,
        required: true,
        minLength: [10,"Phone Number Must Contain Exact 10 Digits!"],
        maxLength: [10,"Phone Number Must Contain Exact 10 Digits!"],
    },
    nic:{
        type: String,
        required: true,
        minLength: [5,"NIC Must Contain Exact 5 Digits!"],
        maxLength: [5,"NIC Must Contain Exact 5 Digits!"],
    },
    dob:{
       type: Date,
       required: [true, "DOB is required!"],
    },
    gender:{
        type: String,
        enum: ["Male", " Female"],
    },
    appointment_date: {
        type: String,
        required: [true, "Appointment Date Is Required!"],
    },
    department: {
        type: String,
        required: [true, "Department Name Is Required!"],
    },
    doctor: {
        firstName: {
          type: String,
          required: [true, "Doctor Name Is Required!"],
        },
        lastName: {
          type: String,
          required: [true, "Doctor Name Is Required!"],
        },
    },
    hasVisited: {
        type: Boolean,
        default:false ,
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Doctor Id Is Invalid!"],
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Patient Id Is Required!"],
    },
    address: {
        type: String,
        required: [true, "Address Is Required!"],
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);