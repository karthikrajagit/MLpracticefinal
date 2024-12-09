import express from 'express';
import {google, signup, update} from '../controller/user.controller.js';
import { signin } from '../controller/user.controller.js';
import { saveCodeToServer, code } from '../controller/code.controller.js';
const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google', google)
router.post('/update', update)
router.post('/save-code', saveCodeToServer);
router.get('/code/:userId/:problemId', code);
export default router;
