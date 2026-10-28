const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const connectDB = require("../../database/connect");
const router = require("../../routes/route");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "../../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
const handler = serverless(app);
exports.handler = async (event, context) => {
  if (!process.env.DB_URI) return {statusCode:503, headers:{'content-type':'text/plain; charset=utf-8'},body:'Database is not configured. Set DB_URI on Netlify.'};
  try { await connectDB(); return await handler(event,context); }
  catch(e) { console.error('Backend error:',e.message); return {statusCode:503,body:'Database connection unavailable. Please try again later.'}; }
};
