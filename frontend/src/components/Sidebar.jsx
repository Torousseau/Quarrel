import React, { useEffect, useState } from "react";
import "../assets/styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/GetAccesToken.js";

export default function Sidebar({ userId, onSelectServer }) {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user] = useState(JSON.parse(localStorage.getItem("user"))?.user || null);
    const [selectedServer, setSelectedServer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServers = async () => {
            const token = getAccessToken();
            if (!token) {
                setError("No valid access token found. Please login again.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`http://localhost:8000/api/user/${userId}/servers/`, {
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

                if (!res.ok) throw new Error("Aucun serveur trouvé pour cet utilisateur");

                const data = await res.json();
                setServers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchServers();
    }, [userId]);

    useEffect(() => {
        if (servers.length > 0) {
            setSelectedServer(servers[0]);
            onSelectServer?.(servers[0]);
        }
    }, [servers]);

    function handleLogout() {
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    }

    return (
        <div className="sidebar">
            <h2 className="sidebar-title">Vos serveurs</h2>

            {loading && <p className="sidebar-loading">Chargement...</p>}
            {error && <p className="sidebar-error">{error}</p>}

            <ul className="server-list">
                {servers.map((server) => (
                    <li
                        key={server.id}
                        className={`server-item ${selectedServer?.id === server.id ? "selected" : ""}`}
                        onClick={() => {
                            setSelectedServer(server);
                            onSelectServer?.(server);
                        }}
                    >
                        <div className="server-icon">
                            {server.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="server-name">{server.name}</span>
                    </li>
                ))}
            </ul>

            {user && (
                <div className="sidebar-profile">
                    <div className="profile-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <span className="profile-email">{user.username}</span>
                        <button className="logout-button" onClick={handleLogout}>
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
