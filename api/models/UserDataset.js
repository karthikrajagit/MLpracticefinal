import mongoose from "mongoose";


const uploadDataset = new mongoose.Schema({
    userId : {
        type: String,
        required: true
    },
    filename: 
    {
          type: String, 
          required: true,
    },
      
},
{
    timestamps: true
})

const UserDataset = mongoose.model('UserDataset', uploadDataset)

export default UserDataset;