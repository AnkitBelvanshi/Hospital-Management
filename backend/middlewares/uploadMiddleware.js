// import multer from "multer";
// import path from "path";
// import fs from "fs";


// const uploadDir="uploads/";
// if(!fs.existsSync(uploadDir)){
//     fs.mkdirSync(uploadDir,{recursive: true});
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb)=>{
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });


// const fileFilter = (req,file,cb)=>{
//     const allowedTypes =["image/jpeg","image/png","application/pdf"];
//     if(allowedTypes.includes(file.mimetype)){
//         cb(null,true);
//     }else{
//         cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."),false);
//     }
// };


// const upload = multer ({
//     storage,
//     fileFilter,
//     limits: {fileSize: 5*1024*1024}
// });

// export default upload;