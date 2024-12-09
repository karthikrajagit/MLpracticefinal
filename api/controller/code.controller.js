import Code from '../models/Code.js';
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