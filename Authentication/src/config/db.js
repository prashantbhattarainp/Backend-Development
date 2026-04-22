const mongoose = require('mongoose')

 const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected")
    }
    catch(error){
        console.log("Error Connecting MongoDB")
        throw error;
    }
 }

 module.exports = connectDB;