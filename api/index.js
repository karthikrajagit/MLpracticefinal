import express from "express";
import mongoose from "mongoose";
import adminroutes from "./routes/problem.route.js";
import dotenv from 'dotenv';
import userroutes from "./routes/user.route.js";
import cors from 'cors'
import path from 'path';

dotenv.config();
 // Enable CORS for all routes

const app = express();
const __dirname = path.resolve();
app.use(express.json());
app.set("view engine", "ejs");
app.use(cors());
const startServer = async () => {
  try {
    mongoose.connect(process.env.MONGO);
    console.log("MongoDB connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });


    
    app.use('/api/v1/admin', adminroutes);
    app.use('/api/v1/user', userroutes);

    app.use(express.static('client/dist'));
    app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
    });


  } catch (err) {
    console.error(err);
  }
};

startServer();
