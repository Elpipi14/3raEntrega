import { ChatModel } from "../schema/chat.model.js"

export default class ChatManager {
    // Método para crear un nuevo chat
    async createChat(email, message) {
        try {
            const chat = new ChatModel({ email, message });
            await chat.save();
            return chat;
        } catch (error) {
            console.error("Error creating chat:", error);
            throw error;
        }
    }

    // Método para obtener todos los chats
    async getAllChats() {
        try {
            const chats = await ChatModel.find({}).lean();
            return chats;
        } catch (error) {
            console.error("Error getting all chats:", error);
            throw error;
        }
    }

}