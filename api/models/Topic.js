import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    }
})


const Topic = mongoose.model('Topic', topicSchema);

export default Topic;