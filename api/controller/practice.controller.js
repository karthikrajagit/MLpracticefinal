import UserDataset from "../models/UserDataset.js";
import fs from 'fs';
import csv from 'csv-parser'; 

export const userUpload = async (req, res) => {
  const { userId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const existingDataset = await UserDataset.findOne({ userId });

    // If user already has a dataset, delete the old file from the directory
    if (existingDataset) {
      const oldFilePath = `flask-app/userdataset/${existingDataset.filename}`;

      // Check if file exists before deleting
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // Delete the old file
      }

      // Update the dataset with the new file name
      existingDataset.filename = req.file.filename;
      await existingDataset.save();
    } else {
      // If no dataset exists, create a new one
      const newData = new UserDataset({
        userId,
        filename: req.file.filename,
      });

      await newData.save();
    }

    // Process CSV file
    const fileResults = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(`flask-app/userdataset/${req.file.filename}`)
        .pipe(csv())
        .on('data', (data) => fileResults.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    res.json({
      message: 'File uploaded and processed successfully',
      file: req.file.filename,
      data: fileResults,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};



export const retrieveuserdataset = async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find the latest dataset for the user (if multiple exist)
      const dataset = await UserDataset.findOne({ userId }).sort({ createdAt: -1 });
  
      if (!dataset) {
        return res.status(404).json({ message: "No dataset found for this user" });
      }
  
      // Send only the filename
      res.json({ filename: dataset.filename });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };