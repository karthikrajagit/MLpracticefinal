import Code from '../models/Code.js';
import UserCode from '../models/UserCode.js';
export const saveCodeToServer = async (req, res) => {

    const { userId, problemId, code } = req.body;
    try {
        if(!userId || !problemId || !code){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(Code.findOne({ userId, problemId })){
            const updatedDocument = await Code.updateOne(
                { userId, problemId }, // Find by userId and problemId
                { $set: { code } },    // Set the new code
                { upsert: true }  
            );
            return res.status(201).json({ message: "Code updated successfully" });
        }
        const newCode = new Code({ userId, problemId, code });
        await newCode.save();
        res.status(201).json({ message: "Code saved successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const code = async (req, res) => {
    const { userId, problemId } = req.params;

    if(!userId || !problemId){
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const code = await Code.findOne({ userId, problemId });
        if (!code) {
            return res.status(404).json({ message: "Code not found" });
        }
        res.status(201).json(code);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const retrieveUsercode = async (req, res) => {
    const { userId } = req.params;

    if(!userId){
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const code = await UserCode.findOne({ userId});
        if (!code) {
            return res.status(404).json({ message: "Code not found" });
        }
        res.status(201).json(code);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const saveUserCode = async (req, res) => {

    const { userId, code } = req.body;
    try {
        if(!userId || !code){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(UserCode.findOne({ userId})){
            const updatedDocument = await UserCode.updateOne(
                { userId}, 
                { $set: { code } },    // Set the new code
                { upsert: true }  
            );
            return res.status(201).json({ message: "Code updated successfully" });
        }
        const newCode = new UserCode({ userId,code });
        await newCode.save();
        res.status(201).json({ message: "Code saed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}