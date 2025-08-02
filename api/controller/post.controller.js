import Subtopic from "../models/Subtopic.js";
import Topic from "../models/Topic.js";
import Content from "../models/Content.js";


export const postTopic = async (req, res) => {
    try {
        const { topic } = req.body;
        const newTopic = new Topic({ topic });
        await newTopic.save();
        res.status(201).json({ message: 'Topic created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Topic creation error"  });
    }
};

export const postSubtopic = async (req, res) => {
    try {
        console.log("Finded")
        const {topic, subtopic} = req.body;
        const newSubtopic = new Subtopic({topic, subtopic});
        await newSubtopic.save();
        return res.status(201).json({ message: 'Subtopic created successfully' });
    } catch (error) {
        return res.status(500).json({ message: "Subtopic creation error"  });
    }
}

export const postContent = async (req, res) => {
  try {
    console.log("Received request");

    const { subtopic, title, content } = req.body;


    const newContent = new Content({ subtopic: subtopic.trim(), title, content });
    await newContent.save();
    return res.status(201).json({ message: 'Subtopic created successfully' });
    

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Subtopic creation or update error" });
  }
};

