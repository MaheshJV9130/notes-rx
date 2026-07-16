import mongoose from "mongoose";

export default async function database(){
   try{
      await mongoose.connect(process.env.DB_URL)
      console.log("Connected")
   }catch(err){
      console.log("Failed to Connect..")
      console.log(err)
   }
}