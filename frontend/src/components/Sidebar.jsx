import React, { useEffect, useState } from "react";
import "../assets/styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/GetAccesToken.js";
import Logo from "../assets/Logo.png";

export default function Sidebar({ userId, onSelectServer, setAddServerModalOpen }) {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))?.user || null);
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

            try {
                const res = await fetch(`http://localhost:8000/api/user/${userId}/servers/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
    }, [userId, token]);

    useEffect(() => {
        if (servers.length > 0) {
            setSelectedServer(servers[0]);
            onSelectServer?.(servers[0]);
        }
    }, [servers]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        if (!user?.id || !token) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/user/profile/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (!res.ok) return;

                const data = await res.json();
                setUser((prev) => ({
                    ...prev,
                    avatar: data.avatar || prev.avatar,
                    username: data.username || prev.username
                }));
            } catch (err) {
                console.error("Erreur fetch user profile:", err);
            }
        };

        fetchProfile();
    }, [user?.id, token]);

    return (
        <div className="sidebar">
            <img src={Logo} alt="Logo" className="sidebar-logo" />
            <button
                className="button-add-server"
                onClick={() => setAddServerModalOpen(true)}
            >
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
                            <img src={`http://127.0.0.1:8000${user.avatar}`} alt={user.username.charAt(0).toUpperCase()} />
                        ) : (
                            <div className="avatar-placeholder">{user.username.charAt(0).toUpperCase()}</div>
                        )}
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
