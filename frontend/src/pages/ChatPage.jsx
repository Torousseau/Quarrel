import React, { useState } from "react";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";

const ChatApp = ({ channel }) => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: `Hello Mobelli !`, username: "QuarrelBot", color: "#7289da" }
    ]);

    const handleSend = (text) => {
        if (!text.trim()) return;
        const userMsg = { sender: "user", text, username: "You", color: "#43b581" };
        setMessages([...messages, userMsg]);
    };

    return (
        <div className="chat-app">
            <ChatHeader title={`${channel}`} />
            <ChatMessages messages={messages} />
            <ChatInput onSend={handleSend} />
        </div>
    );
};

export default ChatApp;
