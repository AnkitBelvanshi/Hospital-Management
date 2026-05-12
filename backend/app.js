import express from "express";
import {config} from "dotenv";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import {errorMiddleware} from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import symptomChecker from "./router/symptomChecker.js";
import medicalRecordsRouter from "./router/medicalRecordsRouter.js";
import emergencyRoutes from "./router/emergencyRoutes.js";
import bedRouter from "./router/bedRouter.js";
import medicalRoutes from "./router/medicalRecordsRouter.js";
// import { getAdminDetails } from "./controller/userController.js";

const app=express();
config({ path:"./config/config.env"});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    cors({
        origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
        methods:["GET", "POST","PUT","DELETE"],
        credentials:true,
    })
);

app.use(cookieParser());

// ✅ Multer should handle form-data requests before JSON parsing
// import {upload} from "./middlewares/multer.js";
// app.use(upload.single("file"));
// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );
// backend/app.js



dbConnection();

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/symptom-checker",symptomChecker);
app.use("/api/v1/medical-records",medicalRecordsRouter);
app.use("/api/v1/emergency",emergencyRoutes);
app.use("/api/v1/bed", bedRouter);
app.use("/api/v1/medical", medicalRecordsRouter);

//console.log("Registered Routes:", app._router.stack
//    .filter(r => r.route)
//    .map(r => r.route.path)
//);
// --------Change ---------
// app.post('/api/v1/user/admin/me', authenticateAdmin, async (req, res) => {
//     try {
//       const adminDetails = await getAdminDetails(req, res);
//       res.json({ success: true, admin: adminDetails });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
//   });
  
// function authenticateAdmin(req, res, next) {
//     const token = req.cookies.adminToken; // Extract token from cookies
//     if (!token) {
//         return res.status(401).json({ success: false, message: 'Admin Not Authenticated!' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
//         req.user = decoded; // Set user from token
//         next();
//     } catch (error) {
//         res.status(401).json({ success: false, message: 'Admin Not Authenticated!' });
//     }
// }


  // backend/app.js
  app.post('/api/v1/user/login', (req, res, next) => {
    try {
      // login logic here
      const user = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
      res.json({ success: true, data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    next();
  });
  
app.use(errorMiddleware);
export default app;
