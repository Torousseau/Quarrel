import { useState } from "react";
import { X } from "lucide-react";
import "../assets/styles/AddServerModal.css";

export default function AddServerModal({ isOpen, onClose, onJoin, onCreate }) {
    const [inviteCode, setInviteCode] = useState("");
    const [serverName, setServerName] = useState("");

    if (!isOpen) return null;

    return (
        <div className="add-server-overlay">
            <div className="add-server-modal">
                <button
                    onClick={onClose}
                    className="add-server-close"
                >
                    <X size={20} />
                </button>

                <div className="add-server-grid">
                    <div className="add-server-section">
                        <h2>Rejoindre un serveur</h2>
                        <p>
                            Entre un code d'invitation pour rejoindre un serveur existant.
                        </p>
                        <input
                            type="text"
                            placeholder="Code d'invitation"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                        />
                        <button
                            onClick={() => onJoin?.(inviteCode)}
                            disabled={!inviteCode}
                        >
                            Rejoindre
                        </button>
                    </div>

                    <div className="add-server-section">
                        <h2>Créer un serveur</h2>
                        <p>
                            Crée ton propre serveur et invite tes amis.
                        </p>
                        <input
                            type="text"
                            placeholder="Nom du serveur"
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                        />
                        <button
                            onClick={() => onCreate?.(serverName)}
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
