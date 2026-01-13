import React, { useEffect, useRef } from "react";
import "../assets/styles/ChatMessages.css";

const ChatMessages = ({ messages }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-messages">
            {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender}`}>
                    <span className="avatar">{msg.avatar}</span>

                    <div className="content">
                        <span className="username">{msg.from}</span>
                        <span className="text">{msg.content}</span>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;
