import Formdata from '../models/Formdata.js';
import fs from 'fs';
import csv from 'csv-parser';


export const upload = async (req, res) => {
  const { title, description, output, level } = req.body;
  const parsedOutput = JSON.parse(output);
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  try {
    // Create a new Formdata entry
    const newData = new Formdata({
      title,
      description,
      output: parsedOutput,
      level,
      filenames: req.files.map((file) => file.filename), // Array of filenames
    });
    await newData.save();

    const results = [];
    for (const file of req.files) {
      const fileResults = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream(`flask-app/uploads/${file.filename}`) // Correct file path
          .pipe(csv())
          .on('data', (data) => fileResults.push(data))
          .on('end', resolve)
          .on('error', reject);
      });
      results.push({ file: file.filename, data: fileResults }); // Store parsed data
    }

    // Send response with parsed data
    res.json({
      message: 'Files uploaded and processed successfully',
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
};