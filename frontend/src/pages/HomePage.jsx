import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChannelList from "../components/ChannelList";
import "../assets/styles/HomePage.css";
import { getAccessToken } from "../utils/GetAccesToken.js";
import ChatMessages from "../components/ChatMessages.jsx";
import ChatInput from "../components/ChatInput.jsx";
import AddServerModal from "../components/AddServerModal.jsx";
import SettingsModal from "../components/SettingsModal.jsx";
import "../assets/styles/theme.css";
import apiLink from "../config/ApiLink.js";
import LoadingPage from "./LoadingPage.jsx";

export default function HomePage() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))?.user);

    const [selectedServer, setSelectedServer] = useState(null);
    const [channels, setChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [addServerModalOpen, setAddServerModalOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);

    const [refreshServers, setRefreshServers] = useState(false);

    useEffect(() => {
        const fetchChannels = async () => {
            if (!selectedServer || addServerModalOpen || settingsModalOpen) return;

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
                const url = `${apiLink}/api/server/${selectedServer.id}/channels/`;
                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Erreur lors du chargement des canaux");

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
    }, [selectedServer, addServerModalOpen, settingsModalOpen]);

    const handleRefreshServers = () => setRefreshServers(prev => !prev);

    const handleUpdateUser = (updatedUser) => {
        const stored = JSON.parse(localStorage.getItem("user")) || {};
        localStorage.setItem(
            "user",
            JSON.stringify({
                ...stored,
                user: updatedUser
            })
        );
        setUser(updatedUser);
        handleRefreshServers()
    };


    return (
        <div className="home-container">
            <Sidebar
                user={user}
                onSelectServer={setSelectedServer}
                setAddServerModalOpen={setAddServerModalOpen}
                setSettingsModalOpen={setSettingsModalOpen}
                refreshServers={refreshServers}
            />

            {addServerModalOpen && (
                <AddServerModal
                    isOpen={true}
                    onClose={() => setAddServerModalOpen(false)}
                    onJoin={handleRefreshServers}
                />
            )}

            {settingsModalOpen && (
                <SettingsModal
                    isOpen={true}
                    onClose={() => setSettingsModalOpen(false)}
                    user={user}
                    onUserUpdate={handleUpdateUser}
                />
            )}

            <div className="home-content">
                {!addServerModalOpen && !settingsModalOpen && (
                    selectedServer ? (
                        <>
                            <div className="channels-content">
                                {loading && <LoadingPage />}
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
                                ) : <></>}
                            </div>
                        </>
                    ) : (
                        <div className="server-placeholder" />
                    )
                )}
            </div>
        </div>
    );
}