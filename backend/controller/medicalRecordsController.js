import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import MedicalRecord from "../models/medicalRecordsSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const addMedicalRecord = catchAsyncErrors(async (req, res, next) => {
    console.log("Request received for adding medical record.");

    // // ✅ Check if a file was uploaded
    // if (!req.files || Object.keys(req.files).length === 0) {
    //     return next(new ErrorHandler("Medical record file is required!", 400));
    // }

    // ✅ Extract file and validate type
    console.log(req.body)
    console.log(req.file?.path)
    const  medicalFile  = req.file?.path;
    // console.log(medicalFile)
    // const allowedFormats = ["image/png", "image/jpeg", "application/pdf"];
    
    // if (!allowedFormats.includes(medicalFile.mimetype)) {
    //     return next(new ErrorHandler("File format not supported! Only JPG, PNG, and PDF are allowed.", 400));
    // }

    // ✅ Validate required fields
    const { firstName, lastName, email, patientId, recordType, recordData } = req.body;

    if (!firstName || !lastName || !email || !patientId || !recordType || !recordData) {
        return next(new ErrorHandler("Missing required fields!", 400));
    }

    console.log("Validating patient ID...");
    const patientExists = await User.findById(patientId);
    if (!patientExists) {
        return next(new ErrorHandler("Patient not found!", 404));
    }
    
    // ✅ Upload file (Cloudinary or Local Storage)
    let fileUrl = null;
    try {

        const cloudinaryResponse = await uploadOnCloudinary(medicalFile)
        console.log(cloudinaryResponse)
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("Cloudinary Upload Error:", cloudinaryResponse.error || "Unknown Error");
            return next(new ErrorHandler("Failed to upload medical record file!", 500));
        }
        
        fileUrl = cloudinaryResponse?.secure_url; // ✅ Cloudinary URL

    } catch (error) {
        console.error("Cloudinary Exception:", error);
        return next(new ErrorHandler("File upload failed!", 500));
    }

    // ✅ Save record to the database
    const newRecord = new MedicalRecord({
        firstName,
        lastName,
        email,
        patientId,
        recordType,
        recordData,
        fileUrl,
    });

    await newRecord.save();

    res.status(200).json({
        success: true,
        message: "Medical record saved successfully!",
        record: newRecord,
    });
});


export const getAllMedicalRecords = catchAsyncErrors(async (req, res, next) => {
    console.log("Fetching all medical records");
    console.log("isAdminAuthenticated Middleware Passed? req.user =", req.user);
    console.log("Authenticated User:", req.user); // 🔍 shows which user is hitting this route

    const records = await MedicalRecord.find();

    res.status(200).json({
        success: true,
        records,
    });
});

export const getMedicalRecordsByPatient = catchAsyncErrors(async (req, res, next) => {
    const { patientId } = req.params;

    const doctorDepartment=req.user.doctorDepartement;

    const patient =await User.findById(patientId);
    if(!patient){
        return next(new ErrorHandler("Patient not found!",404));
    }

    const doctor=await User.findById(req.user.id);
    if(!doctor || doctor.role!=="Doctor"){
        return next(new ErrorHandler("Unauthorized access!",403));
    }

    const records = await MedicalRecord.find({ patientId });
    if (!records.length) {
        return next(new ErrorHandler("No medical records found for this patient!", 404));
    }

    res.status(200).json({
        success: true,
        records
    });
});


export const updateMedicalRecord = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    let record = await MedicalRecord.findOne({patientId:id});
    if (!record) {
        return next(new ErrorHandler("Medical record not found!", 404));
    }

    record = await MedicalRecord.findByIdAndUpdate(record._id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Medical record updated successfully",
        record,
    });
});

export const deleteMedicalRecord = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const record = await MedicalRecord.findById(id);
    if (!record) {
        return next(new ErrorHandler("Medical record not found!", 404));
    }

    await record.deleteOne();

    res.status(200).json({
        success: true,
        message: "Medical record deleted successfully",
    });
});