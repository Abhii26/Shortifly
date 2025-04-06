const mongoose = require("mongoose")
const url = require("../models/schema")
const dotenv = require("dotenv")

dotenv.config()


const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(
            process.env.DB_URI,  
        ) 
        console.log(`MongoDB Connected`)
    } catch (error) { 
        console.error(error.message)
    }
}

module.exports = connectDB