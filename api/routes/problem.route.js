import express from 'express';
import { uploadMultipleFiles } from '../middleware/uploadmiddleware.js'; 
import { getAllproblems,  getProblemById} from '../controller/problem.controller.js';
import { upload } from '../controller/admin.controller.js';
import { postContent, postSubtopic, postTopic } from '../controller/post.controller.js';

const router = express.Router();

router.post('/upload', uploadMultipleFiles, upload);
router.get('/problems', getAllproblems);
router.get('/problems/:id', getProblemById);
router.post('/posttopic', postTopic);
router.post('/postsubtopic', postSubtopic);
router.post('/postcontent', postContent);

export default router;
