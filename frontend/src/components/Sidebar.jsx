import React, { useEffect, useState } from "react";
import "../assets/styles/Sidebar.css";
import {useNavigate} from "react-router-dom";

export default function Sidebar({ userId, onSelectServer }) {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    const user = JSON.parse(localStorage.getItem("user"))?.user;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServers = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/users/${userId}/servers`, {
                    headers: {"Authorization": `Bearer ${token}`}
                });
                if (!res.ok) throw new Error("Erreur lors du chargement des serveurs");

                const data = await res.json();
                console.log(data);
                setServers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        console.log(userId)
        if (userId) fetchServers();
    }, [userId]);

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
                        key={server._id}
                        className="server-item"
                        onClick={() => onSelectServer?.(server)}
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
