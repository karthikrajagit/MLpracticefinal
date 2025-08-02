import Formdata from '../models/Formdata.js';
import fs from 'fs';
import csv from 'csv-parser';


export const getAllproblems = async (req, res) => {
  try {
    const problems = await Formdata.find().sort({createdAt: -1});
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getFirstFiveRows = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results.slice(0, 5));
      })
      .on('error', (error) => {
        reject(error);
      });
  })
}

export const getProblemById = async (req, res) => {
  try {
    const problem = await Formdata.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const datasets = problem.filenames || [];
    const outputs = problem.output || [];

    if (datasets.length === 0) {
      return res.status(404).json({ message: 'No datasets available for this problem' });
    }

    const firstFilename = datasets[0];
    const firstoutput = outputs[0] || null;
    const filePath = `flask-app/uploads/${firstFilename}`;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: `Dataset file ${firstFilename} not found` });
    }

    let firstFiveRows;
    try {
      firstFiveRows = await getFirstFiveRows(filePath);
    } catch (error) {
      console.error('Error parsing file:', error);
      return res.status(500).json({ message: 'Error parsing dataset file' });
    }

    res.json({
      ...problem._doc, // Include all fields from the problem document
      filename: firstFilename,
      firstFiveRows,
      outputs,
      datasets,
      output: firstoutput,
    });
  } catch (error) {
    console.error('Error in getProblemById:', error);
    res.status(500).json({ message: 'Error fetching problem' });
  }
};





