import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    email: { type: String, required: true }, // Correo electrónico del remitente
    message: { type: String, required: true }, // Mensaje
});

export const ChatModel = model("Chat", chatSchema);
