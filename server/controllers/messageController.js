import Chat from "../models/Chat.js";
import User from "../models/User.js";
import genAI from "../configs/genai.js";
import axios from "axios";
import imagekit from "../configs/imagekit.js";

// Text based AI chat message controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
    
        if (req.user.credits < 1) {
            return res.json({ success: false, message: "you don't have enough credits to use this feature" })
        }

        const { chatId, prompt } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) return res.json({ success: false, message: "Chat not found" });

        chat.messages.push({ 
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview"});
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

        const { prompt, chatId, isPublished } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) return res.json({ success: false, message: "Chat not found" });

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        // 1. Properly Encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        // 2. Construct ImageKit AI generation URL
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/SmartAssist/${Date.now()}.png?tr=w-800,h-800`;

        // 3. Trigger generation
        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" });

     
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;

        // 5. Upload to Imagekit
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "SmartAssist"
        });

        const reply = {
            role: 'model',
            content: uploadResponse.url, 
            timestamp: Date.now(),
            isImage: true,
            isPublished: isPublished || true
        };

        chat.messages.push(reply);
        await chat.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

        res.json({ success: true, reply });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};