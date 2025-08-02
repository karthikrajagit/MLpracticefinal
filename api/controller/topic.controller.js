import Topic from "../models/Topic.js";
import Subtopic from "../models/Subtopic.js";
import Content from "../models/Content.js";

export const retrieveTopics = async (req, res) => {
    try {
        const data = await Topic.find();
        return res.status(200).json({topics: data});
    } catch (error) {
        return res.staus(500).json({message: "Error occured while retrieving topics!!"});
    }
}


export const retrieveSubTopics = async (req, res) => {
  try {
    const { topic } = req.body; 
    const data = await Subtopic.find({ topic: topic }, 'subtopic');
    const subtopics = data.map(item => item.subtopic);
    return res.status(200).json({ subtopics});
  } catch (error) {
    return res.status(500).json({ message: "Error occurred while retrieving subtopics!!" });
  }
};


export const retrieveContent = async (req, res) => {
  try {
    const { subtopic } = req.params;
    const originalSubtopic = subtopic.replace(/-/g, ' '); 
    console.log(originalSubtopic);

    const data = await Content.find({ subtopic: { $regex: `^${originalSubtopic}$`, $options: 'i' } });

    if (!data || data.length === 0) return res.status(404).json({ message: "Content not found" });

    return res.status(200).json({ contents: data }); // return array
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
