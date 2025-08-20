import User from "../models/Userdata.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserDataset from "../models/UserDataset.js";
import fs from 'fs';
import csv from 'csv-parser'; 


export const signup = async (req, res, next) => {
    const { username, gmail, password } = req.body;

    try {
        if (!username || !gmail || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        if (!emailRegex.test(gmail)) {
            return res.status(400).json({ message: "Invalid email format. Please enter a valid email address." });
        }

        const existingUser = await User.findOne({ gmail });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use. Please use a different email." });
        }

        const hashedpassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            username,
            gmail,
            password: hashedpassword,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        res.cookie('access_token', token, {
            httpOnly: true
        })
        .status(201)
        .json({ message: "User created successfully", user: { id: newUser._id, username, gmail } });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const signin = async (req, res) => {
    const { gmail, password } = req.body;
    try {
        if (!gmail || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const user = await User.findOne({ gmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if(!await bcryptjs.compare(password, user.password)){
            return res.status(401).json({ message: "Incorrect password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.cookie('access_token', token, { httpOnly: true}).status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const google = async (req,res) => {
    const { username, gmail, photo } = req.body;
    try {
        const user = await User.findOne({ gmail });
        if (!user) {
            const password = Math.random().toString(36).substring(2, 15);
            const hashedpassword = await bcryptjs.hash(password, 10);
            const newUser = new User({ username, gmail, password: hashedpassword,avatar: photo });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            res.cookie('access_token', token, { httpOnly: true}).status(201).json(newUser);
        } else {                           
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.cookie('access_token', token, { httpOnly: true}).status(201).json(user);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


