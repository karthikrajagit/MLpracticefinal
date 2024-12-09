import mongoose from "mongoose";


const uploadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    output: [
        {
        type: String,
        required: true
    }
],
    level: {
        type: String,
        required: true
    },
    filenames: [
        {
          type: String, // Array to store multiple file names
          required: true,
        },
      ],
},
{
    timestamps: true
})

const Formdata = mongoose.model('Formdata', uploadSchema)

export default Formdata;