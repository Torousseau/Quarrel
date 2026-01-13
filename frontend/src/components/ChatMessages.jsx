import React, { useEffect, useRef, useState, useMemo } from "react";
import "../assets/styles/ChatMessages.css";
import { getAccessToken } from "../utils/GetAccesToken.js";

const ChatMessages = ({ channelId }) => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const prevMessagesLengthRef = useRef(0);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUsername = storedUser?.user?.username;

    const fetchMessages = async () => {
        if (!channelId) return;

        const token = getAccessToken();
        if (!token) return;

        try {
            const url = `http://localhost:8000/api/channel/${channelId}/messages/`;

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const text = await res.text();
            let data = [];
            try {
                data = JSON.parse(text);
            } catch {
                console.warn("Réponse du fetch non JSON :", text);
            }

            setMessages(data);
        } catch (err) {
            console.error("Erreur fetch messages :", err);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 500);
        return () => clearInterval(interval);
    }, [channelId]);

    useEffect(() => {
        if (messages.length > prevMessagesLengthRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        prevMessagesLengthRef.current = messages.length;
    }, [messages]);

    const renderedMessages = useMemo(() => {
        return messages.map((msg, idx) => {
            const isUser =
                msg.from?.trim().toLowerCase() ===
                currentUsername?.trim().toLowerCase();

            return (
                <div key={idx} className={`message ${isUser ? "user" : "bot"}`}>
                    <span className="avatar">{msg.avatar}</span>
                    <div className="content">
                        {!isUser && <span className="username">{msg.from}</span>}
                        <span className="text">{msg.content}</span>
                    </div>
                </div>
            );
        });
    }, [messages, currentUsername]);

    return (
        <div className="chat-messages">
            {renderedMessages}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;
