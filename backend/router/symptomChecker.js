import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {config} from "dotenv"

config({ path:"./config/config.env"});
const router = express.Router();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Symptom checker route
router.post("/", catchAsyncErrors(async (req, res, next) => {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
        return next(new ErrorHandler("Please provide symptoms.", 400));
    }

    const prompt = `The patient has the following symptoms: ${symptoms.join(
        ", "
      )}. Based on this, suggest only the possible medical conditions in a concise list format without explanations.`;
      

    try {
        const model=genAI.getGenerativeModel({model:"gemini-1.5-pro-002"});
        const response = await model.generateContent(prompt);
        const diagnosis= response.response.candidates[0].content.parts[0].text;

        res.status(200).json({
            success: true,
            diagnosis,
        });
    } catch (error) {
        console.error("Error with Gemini API:",error);
        return next(new ErrorHandler("Error processing the request.", 500));
    }
}));

export default router;
