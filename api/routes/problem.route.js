import express from 'express';
import { uploadMultipleFiles } from '../middleware/uploadmiddleware.js'; // Import the configured method for multiple files
import { getAllproblems,  getProblemById, upload } from '../controller/problem.controller.js';

const router = express.Router();

// Use `uploadMultipleFiles` for handling multiple file uploads
router.post('/upload', uploadMultipleFiles, upload);
router.get('/problems', getAllproblems);
router.get('/problems/:id', getProblemById);
//router.get('/datasets/:id', getdatasets);

export default router;
