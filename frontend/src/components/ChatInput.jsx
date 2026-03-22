import React, { useState } from "react";
import "../assets/styles/ChatInput.css";
import "../assets/styles/theme.css"
import {getAccessToken} from "../utils/GetAccesToken.js";
import apiLink from "../config/ApiLink.js";
import { IoSend } from "react-icons/io5";

const ChatInput = ({ channelId, onMessageSent }) => {
    const [input, setInput] = useState("");
    const token = getAccessToken()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            const response = await fetch(`${apiLink}/api/message/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: input,
                    channel_id: channelId
                }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'envoi du message");
            }

            const data = await response.json();
            if (onMessageSent) onMessageSent(data);

            setInput("");
        } catch (error) {
            console.error(error);
            alert("Impossible d'envoyer le message");
        }
    };

    return (
        <form className="chat-input" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Envoyer un message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit"><IoSend /></button>
        </form>
    );
};

export default ChatInput;
