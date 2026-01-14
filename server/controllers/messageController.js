import Chat from "../models/Chat.js";
import User from "../models/User.js";
import genAI from "../configs/gemini.js";

// Text based AI chat message controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) return res.json({ success: false, message: "Chat not found" });

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        const reply = {
            role: "assistant",
            content: aiResponse,
            timestamp: Date.now(),
            isImage: false
        };

        chat.messages.push(reply);
        await chat.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

        res.json({ success: true, reply });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Image Generation message controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.user.credits < 2) {
            return res.json({ success: false, message: "You don't have enough credits" });
        }

        const { prompt, chatId , isPublished} = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) return res.json({ success: false, message: "Chat not found" });
        
        // find chat

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

      

    } catch (error) {
       
    }
};
