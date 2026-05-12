import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "Project0"
    }).then(()=>{
        console.log("Connected to DB!")
    }).catch(err=>{
        console.log(`some error occured connecting to DB: ${err}`);
    });
};