import express from 'express';
import {google, retrieveuserdataset, signup, userUpload} from '../controller/user.controller.js';
import { signin } from '../controller/user.controller.js';
import { saveCodeToServer, code, saveUserCode, retrieveUsercode } from '../controller/code.controller.js';
import {uploadUserFiles} from '../middleware/useruploadmiddleware.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google', google)
router.post('/save-code', saveCodeToServer);
router.post('/save/usercode',saveUserCode);
router.get('/code/:userId/:problemId', code);
router.post('/userupload', uploadUserFiles, userUpload);
router.get('/getuserdataset/:userId', retrieveuserdataset);
router.get('/code/:userId', retrieveUsercode);
export default router;



