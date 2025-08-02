import mongoose from "mongoose";

const Subtopicschema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },

    subtopic: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Subtopic = mongoose.model("Subtopic", Subtopicschema);
export default Subtopic;