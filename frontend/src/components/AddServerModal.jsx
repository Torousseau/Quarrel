import { useState } from "react";
import { X } from "lucide-react";
import "../assets/styles/AddServerModal.css";
import "../assets/styles/theme.css"
import { getAccessToken } from "../utils/GetAccesToken.js";
import apiLink from "../config/ApiLink.js";

export default function AddServerModal({ isOpen, onClose, onJoin, onCreate }) {
    const [inviteCode, setInviteCode] = useState("");
    const [serverName, setServerName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoinServer = async () => {
        if (!inviteCode) return;

        setLoading(true);

        try {
            const res = await fetch(`${apiLink}/api/server/join/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getAccessToken()}`,
                },
                body: JSON.stringify({ invite_code: inviteCode }),
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la requête");
            }

            const data = await res.json();

            onJoin?.(data);
            setInviteCode("");
            onClose();
        } catch (err) {
            console.error(err);
            alert("Impossible de rejoindre le serveur");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateServer = async () => {
        if (!serverName) return;

        onCreate?.(serverName);
        setServerName("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="add-server-overlay">
            <div className="add-server-modal">
                <button onClick={onClose} className="add-server-close">
                    <X size={20} />
                </button>

                <div className="add-server-grid">
                    <div className="add-server-section">
                        <h2>Rejoindre un serveur</h2>
                        <p>Entre un code d'invitation pour rejoindre un serveur existant.</p>

                        <input
                            type="text"
                            placeholder="Code d'invitation"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                        />

                        <button
                            onClick={handleJoinServer}
                            disabled={!inviteCode || loading}
                        >
                            {loading ? "Connexion..." : "Rejoindre"}
                        </button>
                    </div>

                    <div className="add-server-section">
                        <h2>Créer un serveur</h2>
                        <p>Crée ton propre serveur et invite tes amis.</p>

                        <input
                            type="text"
                            placeholder="Nom du serveur"
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                        />

                        <button
                            onClick={handleCreateServer}
                            disabled={!serverName}
                        >
                            Créer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
