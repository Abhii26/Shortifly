const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    shortUrl : {
        type : String,
        required : true,
        unique : true
    },
    redirectUrl : {
        type : String,
        required : true
    }, 
    visitRecord : [{timestamp : {type : Number}}],
    

},{timestamp : true})

const url = mongoose.model("Url", schema);
module.exports = url