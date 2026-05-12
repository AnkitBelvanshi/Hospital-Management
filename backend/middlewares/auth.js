import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
import {User} from "../models/userSchema.js";

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
  
    if (!token) {
      return next(new ErrorHandler("Admin Not Authenticated!", 400));
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
  
    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }
  
    if (user.role !== "Admin") {
      return next(
        new ErrorHandler(`${user.role} not authorized for this resource!`, 403)
      );
    }
  
    req.user = user;
    next();
  });

export const isPatientAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const token=req.cookies.patientToken;
    if(!token){
       return next(new ErrorHandler("Patient Not Authenticated!",400));
    }
    const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if(req.user.role!== "Patient"){
       return next(new ErrorHandler(`${req.user.role} not authorized for this resources!`,
           403
       )
   );
    }
    next();
});

// export const isDoctorAuthenticated = catchAsyncErrors(async(req,res,next)=>{
//     const token=req.cookies.doctorToken;
//     if(!token){
//         return next(new ErrorHandler("Doctor Not Authenticated!",400));
//      }
//      const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY);
//      req.user = await User.findById(decoded.id);
//      if(req.user.role!== "Doctor"){
//         return next(new ErrorHandler(`${req.user.role} not authorized for this resources!`,
//             403
//         )
//     );
//      }
//      const allowedDepartments = ["Cardiology", "Neurology", "Orthopedics", "Radiology"];

//      if(!allowedDepartments.includes(req.user.doctorDepartement)){
//         return next(new ErrorHandler("Access denied: You don't have permission to access this department!",403));
//      }
//      next();
// });

export const isDoctorAuthenticated = (req, res, next) => {
  const token = req.cookies.doctorToken;
  console.log("Checking doctor auth...");

  if (!token) {
    console.warn("❌ Doctor token not found");
    return next(new ErrorHandler("Unauthorized", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Doctor authenticated:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return next(new ErrorHandler("Unauthorized", 401));
  }
};
