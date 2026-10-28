const mongoose = require('mongoose');
require('dotenv').config();
module.exports = async function connectDB() {
  if (!process.env.DB_URI) throw new Error('DB_URI missing');
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  await mongoose.connect(process.env.DB_URI,{serverSelectionTimeoutMS:7000});
  return mongoose.connection;
};
