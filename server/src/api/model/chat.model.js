import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

// Create a model from the schema
const Message = mongoose.model('Message', messageSchema);
export default Message;
