import{catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import {User} from "../models/userSchema.js";
import { Bed } from "../models/bedSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const flagEmergencyPatient =catchAsyncErrors(async(req,res,next)=>{
    const {patientId, priorityStatus}= req.body;

    const patient=await User.findById(patientId);
    if(!patient || patient.role !=="Patient"){
        return next(new ErrorHandler("Patient not found!", 404));
    }

    if(!["Normal", "Urgent", "Critical"].includes(priorityStatus)){
        return next(new ErrorHandler("Invalid priority status!",400));
    }

    patient.priorityStatus=priorityStatus;
    await patient.save();

    res.status(200).json({
        success: true,
        message: `Priority status updated to ${priorityStatus}`,
        patient
    });
});


export const assignEmergencyBed = catchAsyncErrors(async(req,res,next)=>{
    
    const{patientId}=req.body;

    const patient=await User.findById(patientId);
    if(!patient ||patient.role!=="Patient"){
        return next(new ErrorHandler("Patient not found!",404));
    }
    if(patient.admitted){
        return next(new ErrorHandler("Patient is already admitted!",400));
    }

    const availableBed=await Bed.findOne({occupied: false});
    if(!availableBed){
        return next(new ErrorHandler("No beds available",400));
    }

    patient.admitted=true;
    patient.bedNumber=availableBed.bedNumber;
    availableBed.occupied=true;
    availableBed.assignedPatientId=patient._id;

    await patient.save();
    await availableBed.save();

    res.status(200).json({
        success:true,
        message: `Patient assigned to Bed ${availableBed.bedNumber}`,
        patient
    });
});
/*
export const assignEmergencyBed = catchAsyncErrors(async (req, res, next) => {
  const { patientId } = req.body;

  try {
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "Patient") {
      return next(new ErrorHandler("Patient not found!", 404));
    }

    if (patient.admitted) {
      return next(new ErrorHandler("Patient is already admitted!", 400));
    }

    const availableBed = await Bed.findOne({ occupied: false });
    if (!availableBed) {
      return next(new ErrorHandler("No beds available", 400));
    }

    patient.admitted = true;
    patient.bedNumber = availableBed.bedNumber;
    availableBed.occupied = true;
    availableBed.assignedPatientId = patient._id;

    await patient.save();
    await availableBed.save();

    res.status(200).json({
      success: true,
      message: `Patient assigned to Bed ${availableBed.bedNumber}`,
      patient,
    });
  } catch (err) {
    // 👇 Add this to log the full error to console
    console.error("Error in assignEmergencyBed:", err);
    return next(new ErrorHandler("Server Error in assigning bed", 500));
  }
});
*/

export const getBedAvailability = catchAsyncErrors(async(req,res,next)=>{
    const availableBeds=await Bed.find({occupied:false});

    res.status(200).json({
        success: true,
        availableBeds,
        totalAvailable: availableBeds.length
    });
});