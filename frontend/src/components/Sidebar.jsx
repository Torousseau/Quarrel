import React, { useEffect, useState } from "react";
import "../assets/styles/Sidebar.css";
import "../assets/styles/theme.css";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/GetAccesToken.js";
import Logo from "../assets/Logo.png";
import { FaGear } from "react-icons/fa6";
import apiLink from "../config/ApiLink.js";


export default function Sidebar({
                                    user,
                                    onSelectServer,
                                    setAddServerModalOpen,
                                    setSettingsModalOpen,
                                    refreshServers
                                }) {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedServer, setSelectedServer] = useState(null);

    const navigate = useNavigate();
    const token = getAccessToken();

    useEffect(() => {
        const fetchServers = async () => {
            if (!token) {
                setError("No valid access token found. Please login again.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const res = await fetch(`${apiLink}/api/user/${user.id}/servers/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (res.status === 401) {
                    setError("Access token expired or invalid. Please login again.");
                    return;
                }

                if (!res.ok) {
                    throw new Error("Aucun serveur trouvé pour cet utilisateur");
                }

                const data = await res.json();
                setServers(data);

                if (data.length > 0) {
                    setSelectedServer(data[0]);
                    onSelectServer?.(data[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchServers();
    }, [user, token, refreshServers]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="sidebar">
            <img src={Logo} alt="Logo" className="sidebar-logo" />

            <button className="button-add-server" onClick={() => setAddServerModalOpen(true)}>
                Ajouter un serveur
            </button>

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
                        {user.avatar ? (
                            <img
                                src={user.avatar.startsWith("http") ? user.avatar : `${apiLink}${user.avatar}`}
                                alt={user.username.charAt(0).toUpperCase()}
                            />
                        ) : (
                            <div className="avatar-placeholder">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        <span className="profile-email">
                            <span className="profile-name">{user.username}</span>
                            <span className="profile-tag">#{user.tag}</span>
                        </span>
                        <button className="logout-button" onClick={handleLogout}>
                            Déconnexion
                        </button>
                    </div>
                    <div className="settings-icon" onClick={() => setSettingsModalOpen(true)}>
                        <FaGear />
                    </div>
                </div>
            )}
        </div>
    );
}
