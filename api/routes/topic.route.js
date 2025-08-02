import express from "express";
import { retrieveContent, retrieveSubTopics, retrieveTopics } from "../controller/topic.controller.js";

const router = express();

router.get('/retrievetopics', retrieveTopics);
router.post('/retrievesubtopics', retrieveSubTopics);
router.get('/content/:subtopic', retrieveContent);

export default router;