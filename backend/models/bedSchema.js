import mongoose from "mongoose";
import validator from "validator";

const bedSchema = new mongoose.Schema({
    bedNumber:{
        type: String,
        required: true,
        unique: true
    },
    department:{
        type:String,
        required:true
    },
    occupied:{
        type:Boolean,
        default:false,
    },
    assignedPatientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null,
    }
});

export const Bed = mongoose.model("Bed",bedSchema);