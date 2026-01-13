    import React, { useState } from "react";

const ChannelList = ({ channels, onSelect, current }) => {
    const [username, setUsername] = useState("Mobelli");
    const [localChannels, setLocalChannels] = useState(channels);
    const [showModal, setShowModal] = useState(false);
    const [tempName, setTempName] = useState(username);
    const [activeTab, setActiveTab] = useState("profile");


    const handleSaveProfile = () => {
        setUsername(tempName);
        setShowModal(false);
    };

    return (
        <>
            <div className="channel-list">
                <div className="channels">
                    <div className="channels-header">
                        <h3>Channels</h3>
                        <button
                            className="add-channel-btn"
                            onClick={() => {
                                const name = prompt("Nom du nouveau channel :");
                                if (name && !localChannels.includes(name)) {
                                    setLocalChannels([...localChannels, name]);
                                }
                            }}
                        >
                            +
                        </button>
                    </div>

                    {localChannels.map((ch) => (
                        <button
                            key={ch}
                            className={`channel ${current === ch ? "active" : ""}`}
                            onClick={() => onSelect(ch)}
                        >
                            {ch}
                        </button>
                    ))}
                </div>

                <div className="profile-container">
                    <div className="profile-avatar">{username.charAt(0).toUpperCase()}</div>
                    <div className="profile-name">{username}</div>
                    <button
                        className="profile-edit-btn"
                        onClick={() => {
                            setTempName(username);
                            setShowModal(true);
                        }}
                    >
                        ✎
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Paramètres</h3>

                        {/* Menu onglets */}
                        <div className="modal-tabs">
                            <button
                                className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
                                onClick={() => setActiveTab("profile")}
                            >
                                Profil
                            </button>
                            <button
                                className={`tab-btn ${activeTab === "logout" ? "active" : ""}`}
                                onClick={() => setActiveTab("logout")}
                            >
                                Déconnexion
                            </button>
                        </div>

                        {/* Contenu onglets */}
                        {activeTab === "profile" && (
                            <div className="tab-content">
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                />
                                <div className="modal-actions">
                                    <button onClick={() => setShowModal(false)}>Annuler</button>
                                    <button onClick={handleSaveProfile}>Enregistrer</button>
                                </div>
                            </div>
                        )}

                        {activeTab === "logout" && (
                            <div className="tab-content">
                                <p>Voulez-vous vraiment vous déconnecter ?</p>
                                <button
                                    className="logout-btn"
                                    onClick={() => {
                                        alert("Déconnexion effectuée"); // remplace par ta vraie logique logout
                                        setShowModal(false);
                                    }}
                                >
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </>
    );
};

export default ChannelList;
