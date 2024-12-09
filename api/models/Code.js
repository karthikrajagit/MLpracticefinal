import mongoose from "mongoose";


const CodeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    problemId: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
},{
    timestamps: true
})

const Code = mongoose.model('Code', CodeSchema)

export default Code;