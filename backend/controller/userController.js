import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import{ User} from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async(req,res,next)=>{
    const{firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        gender, 
        dob, 
        nic,
        role,
    }=req.body;
    if(
        !firstName || 
        !lastName || 
        !email || 
        !phone || 
        !password || 
        !gender || 
        !dob || 
        !nic ||
        !role
     ) {
        return next(new ErrorHandler("Please Fill Full Form", 400));
    }
    let user = await User.findOne({ email});
    if(user){
        return next(new ErrorHandler("User Already Registetred!", 400));
    }
    user = await User.create({firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        gender, 
        dob, 
        nic,
        role,
    });
    generateToken(user, "User Registered!", 200, res);
});



export const login= catchAsyncErrors(async(req,res,next)=>{
    const {email,password, confirmPassword, role}=req.body;
    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("Please Provide All Details!", 400));
    }
    if(password !== confirmPassword) {
        return next(new ErrorHandler("Password Mismatched!", 400));
    }
    const user = await User.findOne({email}).select("+password"); 
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password!", 400));
    }  
    const isPasswordMatched= await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password!", 400));
    } 

    if (role.toLowerCase() !== user.role.toLowerCase()) {
        return next(new ErrorHandler("User with this role not found!", 400));
    }
    // generateToken({user, message: "User Login Successfully!", statusCode: 200, res});
    generateToken(user, "User Login Successfully!", 200, res);
});

//--------
export const getAdminDetails = (req, res, next) => {
    try {
      const { password, __v, priorityStatus, admitted, bedNumber, ...safeAdmin } = req.user.toObject();
      res.status(200).json({
        success: true,
        admin: safeAdmin,
      });
    } catch (err) {
      return next(new ErrorHandler("Failed to get admin details", 500));
    }
  };
  

export const addNewAdmin=catchAsyncErrors(async(req,res,next)=>{
    const{firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        gender, 
        dob, 
        nic,
    }=req.body;
    if(
        !firstName || 
        !lastName || 
        !email || 
        !phone || 
        !password || 
        !gender || 
        !dob || 
        !nic 
     ) {
        return next(new ErrorHandler("Please Fill Full Form", 400));
    }
    const isRegistered=await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with This Email Already Exists!`));
    }
    const admin =await User.create({firstName,  lastName,  email,  phone,  password,  gender,  dob, nic, role: "Admin",});
    res.status(200).json({
        success: true,
        message: "New Admin Registered!",
    });
});

export const getAllDoctors = catchAsyncErrors(async(req,res,next)=>{
    const doctors = await User.find({role: "Doctor"});
    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const getAllPatients = catchAsyncErrors(async (req, res, next) => {
    const patients = await User.find({ role: "Patient" }).select("firstName lastName _id");
    res.status(200).json({
      success: true,
      patients,
    });
  });
  

export const logoutAdmin = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("adminToken","",{
      httpOnly:true,
      expires: new Date(Date.now()),
    }).json({
        success: true,
        message: " Admin Logged Out Successfully!",
    });
});

export const logoutPatient = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("patientToken","",{
      httpOnly:true,
      expires: new Date(Date.now()),
    }).json({
        success: true,
        message: " Patient Logged Out Successfully!",
    });
});


export const addNewDoctor= catchAsyncErrors(async(req,res,next)=>{
    // console.log('ss');
    try{
    if (!req.file) {
        return next(new ErrorHandler("Doctor Avatar Required!", 400));
      }
    //  const data=await req.json();
    //  console.log(data);
    const docAvatar=req.file;
    // console.log(req.file);
    console.log(docAvatar);
    const allowedFormats = ["image/png", "image/jpeg", "image/webp" ];
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File Format Not Supported!",400));
    }
    // console.log("Received file:", req.file?.originalname);
    // console.log("Sending avatar:", docAvatar);
    // console.log(req.body);
    const {
        firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        gender, 
        dob, 
        nic,
        doctorDepartment,
    } =req.body;
    if(
        (!firstName || 
            !lastName || 
            !email || 
            !phone || 
            !password || 
            !gender || 
            !dob || 
            !nic ||
            !doctorDepartment)
    ){
        return next (new ErrorHandler("Please Provide Full Details", 400));
    }
    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next (new ErrorHandler(`${isRegistered.role} already registered with this email!`, 400));
    }
    // const cloudinaryResponse = await cloudinary.uploader.upload(
    //     docAvatar.tempFilePath
    // );
    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.path);

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error|| "Unknown Cloudinary Error"
        );
        return next(
            new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
          );  
    }
    
    const doctor = await User.create({
        firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        gender, 
        dob, 
        nic,
        doctorDepartment,
        role: "Doctor" ,
        docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "New Doctor Registered!",
        doctor
    });
}
catch(err)
{
    console.log(err);
}
   
});