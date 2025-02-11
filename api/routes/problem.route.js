import express from 'express';
import { uploadMultipleFiles } from '../middleware/uploadmiddleware.js'; 
import { getAllproblems,  getProblemById, upload } from '../controller/problem.controller.js';

const router = express.Router();

router.post('/upload', uploadMultipleFiles, upload);
router.get('/problems', getAllproblems);
router.get('/problems/:id', getProblemById);

export default router;
