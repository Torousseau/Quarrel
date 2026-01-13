import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChannelList from "../components/ChannelList";
import "../assets/styles/HomePage.css";
import { getAccessToken } from "../utils/GetAccesToken.js";
import ChatMessages from "../components/ChatMessages.jsx";
import ChatInput from "../components/ChatInput.jsx";
import AddServerModal from "../components/AddServerModal.jsx";

export default function HomePage() {
    const user = JSON.parse(localStorage.getItem("user"))?.user;

    const [selectedServer, setSelectedServer] = useState(null);
    const [channels, setChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [addServerModalOpen, setAddServerModalOpen] = useState(false);

    useEffect(() => {
        const fetchChannels = async () => {
            if (!selectedServer || addServerModalOpen) return;

            setLoading(true);
            setError("");
            setChannels([]);
            setCurrentChannel(null);

            const token = getAccessToken();
            if (!token) {
                setError("Veuillez vous reconnecter.");
                setLoading(false);
                return;
            }

            try {
                const url = `http://localhost:8000/api/server/${selectedServer.id}/channels/`;

                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Erreur lors du chargement des canaux");
                }

                const data = await res.json();
                setChannels(data);
                setCurrentChannel(data[0] || null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChannels();
    }, [selectedServer, addServerModalOpen]);

    return (
        <div className="home-container">
            <Sidebar
                userId={user?.id}
                onSelectServer={setSelectedServer}
                setAddServerModalOpen={setAddServerModalOpen}
            />

            <div className="home-content">
                {addServerModalOpen ? (
                    <AddServerModal
                        isOpen={true}
                        onClose={() => setAddServerModalOpen(false)}
                    />
                ) : selectedServer ? (
                    <>
                        <div className="channels-content">
                            {loading && <p>Chargement...</p>}
                            {error && <p className="error">{error}</p>}

                            {!loading && channels.length > 0 && (
                                <ChannelList
                                    channels={channels}
                                    current={currentChannel}
                                    onSelect={setCurrentChannel}
                                />
                            )}
                        </div>

                        <div className="chat-messages-content">
                            {currentChannel ? (
                                <>
                                    <h2># {currentChannel.name}</h2>
                                    <ChatMessages channelId={currentChannel.id} />
                                    <ChatInput channelId={currentChannel.id} />
                                </>
                            ) : (
                                <h2>Aucun canal sélectionné</h2>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="server-placeholder" />
                )}
            </div>
        </div>
    );
}
