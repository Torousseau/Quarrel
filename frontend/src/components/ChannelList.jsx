import React, { useState, useEffect } from "react";
import "../assets/styles/ChannelsList.css";
import "../assets/styles/theme.css";
import apiLink from "../config/ApiLink.js";
import { getAccessToken } from "../utils/GetAccesToken.js";

const ChannelList = ({
                         channels: initialChannels = [],
                         onSelect,
                         current,
                         serverId = 1,
                         isOpen = true,
                     }) => {
    const [channels, setChannels] = useState(initialChannels);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [newChannelDescription, setNewChannelDescription] = useState("");
    const [loading, setLoading] = useState(false);

    // Sync channels avec la prop
    useEffect(() => {
        setChannels(initialChannels);
    }, [initialChannels]);

    const handleAddChannel = async () => {
        const name = newChannelName.trim();
        if (!name || loading) return;

        setLoading(true);

        try {
            const response = await fetch(`${apiLink}/api/channel/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getAccessToken()}`
                },
                body: JSON.stringify({
                    name,
                    description: newChannelDescription.trim() || "Un salon pour discuter",
                    server_id: serverId
                }),
            });

            if (!response.ok) throw new Error();

            const { id } = await response.json();

            const createdChannel = {
                id,
                name,
                description: newChannelDescription
            };

            setChannels(prev => [...prev, createdChannel]);
            setNewChannelName("");
            setNewChannelDescription("");
            setIsModalOpen(false);
            onSelect?.(createdChannel);

        } catch {
            alert("Impossible de créer le channel.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`channel-list ${isOpen ? "open" : ""}`}>
            <div className="channels">
                <div className="channels-header">
                    <h3>Channels</h3>
                    <button className="add-channel-btn" onClick={() => setIsModalOpen(true)}>
                        +
                    </button>
                </div>

                {channels.map(ch => (
                    <button
                        key={ch.id}
                        className={`channel ${current?.id === ch.id ? "active" : ""}`}
                        onClick={() => onSelect?.(ch)}
                    >
                        # {ch.name}
                    </button>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button
                            className="close-btn"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ×
                        </button>
                        <h4>Add New Channel</h4>
                        <input
                            type="text"
                            placeholder="Channel name"
                            value={newChannelName}
                            onChange={e => setNewChannelName(e.target.value)}
                            disabled={loading}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newChannelDescription}
                            onChange={e => setNewChannelDescription(e.target.value)}
                            disabled={loading}
                        />
                        <div className="modal-actions">
                            <button onClick={handleAddChannel} disabled={loading}>
                                {loading ? "Adding..." : "Add"}
                            </button>
                            <button onClick={() => setIsModalOpen(false)} disabled={loading}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChannelList;
