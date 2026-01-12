import React, {useEffect, useState} from "react";
import Sidebar from "../components/Sidebar";
import "../assets/styles/HomePage.css";
import {getAccessToken} from "../utils/GetAccesToken.js";


export default function HomePage() {
    const user = JSON.parse(localStorage.getItem("user"))?.user;
    const [selectedServer, setSelectedServer] = useState(null);
    const [channels, setChannels] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChannels = async () => {
            if (!selectedServer) return;
            const token = getAccessToken();
            if (!token) {
                setError("No valid access token found. Please login again.");
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`http://localhost:8000/api/servers/${selectedServer.id}/channels/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (res.status === 401) {
                    setError("Access token expired or invalid. Please login again.");
                    setLoading(false);
                    return;
                }
                if (!res.ok) throw new Error("Erreur lors du chargement des canaux");
                const data = await res.json();
                console.log("Channels fetched:", data);
                setChannels(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchChannels();
    }, [selectedServer]);

    return (
        <div className="home-container">
            <Sidebar userId={user?.id} onSelectServer={setSelectedServer} />

            <div className="home-content">
                {selectedServer ? (
                    <div className="server-details">
                        <h2>{selectedServer.name}</h2>
                        <p>ID : {selectedServer._id}</p>
                        <p>Créé le : {new Date(selectedServer.createdAt).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <div className="server-placeholder">
                        <h1>Sélectionnez un serveur</h1>
                    </div>
                )}
            </div>
        </div>
    );
}
