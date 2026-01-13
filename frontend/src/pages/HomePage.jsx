import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChannelList from "../components/ChannelList";
import "../assets/styles/HomePage.css";
import { getAccessToken } from "../utils/GetAccesToken.js";
import ChatMessages from "../components/ChatMessages.jsx";

export default function HomePage() {
    const user = JSON.parse(localStorage.getItem("user"))?.user;

    const [selectedServer, setSelectedServer] = useState(null);
    const [channels, setChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /* ===================== DEBUG GLOBAL ===================== */
    useEffect(() => {
        console.log("👤 Utilisateur connecté :", user);
    }, []);

    useEffect(() => {
        console.log("🖥️ Serveur sélectionné :", selectedServer);
    }, [selectedServer]);

    useEffect(() => {
        console.log("📁 Liste des channels :", channels);
    }, [channels]);

    useEffect(() => {
        console.log("💬 Channel courant :", currentChannel);
    }, [currentChannel]);

    useEffect(() => {
        console.log("📨 Messages :", messages);
    }, [messages]);

    /* ===================== CHANNELS ===================== */
    useEffect(() => {
        const fetchChannels = async () => {
            if (!selectedServer) {
                console.log("⏭️ Aucun serveur sélectionné, fetch channels annulé");
                return;
            }

            console.log("🚀 Fetch des channels pour le serveur :", selectedServer.id);

            setLoading(true);
            setError("");
            setChannels([]);
            setCurrentChannel(null);

            const token = getAccessToken();
            if (!token) {
                console.error("❌ Token manquant");
                setError("Veuillez vous reconnecter.");
                setLoading(false);
                return;
            }

            try {
                const url = `http://localhost:8000/api/server/${selectedServer.id}/channels/`;
                console.log("🌐 Requête :", url);

                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("📡 Réponse channels :", res.status);

                if (!res.ok) throw new Error("Erreur lors du chargement des canaux");

                const data = await res.json();
                console.log("✅ Channels reçus :", data);

                setChannels(data);
                setCurrentChannel(data[0] || null);
            } catch (err) {
                console.error("❌ Erreur fetch channels :", err);
                setError(err.message);
            } finally {
                setLoading(false);
                console.log("🏁 Fin fetch channels");
            }
        };

        fetchChannels();
    }, [selectedServer]);

    /* ===================== MESSAGES ===================== */
    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentChannel) {
                console.log("⏭️ Aucun channel sélectionné, fetch messages annulé");
                return;
            }

            console.log("🚀 Fetch des messages pour le channel :", currentChannel.id);
            setMessages([]);

            const token = getAccessToken();
            if (!token) {
                console.error("❌ Token manquant");
                return;
            }

            try {
                const url = `http://localhost:8000/api/channel/${currentChannel.id}/messages/`;
                console.log("🌐 Requête :", url);

                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("📡 Réponse messages :", res.status);

                if (!res.ok) throw new Error("Erreur lors du chargement des messages");

                const data = await res.json();
                console.log("✅ Messages reçus :", data);

                setMessages(data);
            } catch (err) {
                console.error("❌ Erreur fetch messages :", err);
                setError(err.message);
            }
        };

        fetchMessages();
    }, [currentChannel]);

    return (
        <div className="home-container">
            <Sidebar userId={user?.id} onSelectServer={setSelectedServer} />

            <div className="home-content">
                {selectedServer ? (
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
                                    <ChatMessages messages={messages} />
                                </>
                            ) : (
                                <h2>Aucun canal sélectionné</h2>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="server-placeholder">
                        <h1>Sélectionnez un serveur</h1>
                    </div>
                )}
            </div>
        </div>
    );
}
