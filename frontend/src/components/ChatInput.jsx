import React, { useState } from "react";

const ChatInput = ({ onSend }) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSend(input);
        setInput("");
    };

    return (
        <form className="chat-input" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Envoyer un message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            {/*<button type="submit">Send</button>*/}
        </form>
    );
};

export default ChatInput;
