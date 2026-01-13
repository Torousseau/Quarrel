import React, { useEffect, useRef, useState } from "react";
import "../assets/styles/ChatMessages.css";
import { getAccessToken } from "../utils/GetAccesToken.js";

const ChatMessages = ({ channelId }) => {
    const [messages, setMessages] = useState([]);
    const [profiles, setProfiles] = useState({});
    const messagesEndRef = useRef(null);
    const prevMessagesLengthRef = useRef(0);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = storedUser?.user?.id;

    const token = getAccessToken();

    const fetchMessages = async () => {
        if (!channelId || !token) return;
        try {
            const res = await fetch(`http://localhost:8000/api/channel/${channelId}/messages/`, {
                headers: { Authorization: `Bearer ${token}` },
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

    const fetchProfile = async (userId) => {
        if (!token) return null;
        if (profiles[userId]) return profiles[userId];
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/user/profile/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const profile = await res.json();
            setProfiles((prev) => ({ ...prev, [userId]: profile }));
            return profile;
        } catch (err) {
            console.error("Erreur fetch profile :", err);
            return null;
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 100);
        return () => clearInterval(interval);
    }, [channelId]);

    useEffect(() => {
        messages.forEach((msg) => {
            if (msg.from && !profiles[msg.from]) {
                fetchProfile(msg.from);
            }
        });
    }, [messages]);

    useEffect(() => {
        if (messages.length > prevMessagesLengthRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        prevMessagesLengthRef.current = messages.length;
    }, [messages]);

    return (
        <div className="chat-messages">
            {messages.map((msg, idx) => {
                const isUser = msg.from === currentUserId;
                const profile = profiles[msg.from];

                return (
                    <div key={idx} className={`message ${isUser ? "user" : "bot"}`}>
                        <span className="avatar">
                            {
profile && profile.avatar ? (
                                <img src={`http://127.0.0.1:8000${profile.avatar}`} alt="avatar" />
                            ) : (
                                <div className="avatar-placeholder">{(profile?.username || "U").charAt(0).toUpperCase()}</div>
                            )
                            }
                        </span>
                        <div className="content">
                            {!isUser && <span className="username">{profile?.username || "Utilisateur"}</span>}
                            <span className="text">{msg.content}</span>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;