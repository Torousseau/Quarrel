import React, { useState } from "react";
import "../assets/style/ProfileCard.css";

const ProfileCard = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("Mobelli");
    const [avatar, setAvatar] = useState("https://via.placeholder.com/50");

    const handleSave = () => {
        setIsEditing(false);
        // Ici tu pourrais envoyer les infos au backend
    };

    return (
        <div className="profile-card">
            {isEditing ? (
                <div className="profile-edit">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="URL de l'avatar"
                    />
                    <button onClick={handleSave}>Enregistrer</button>
                </div>
            ) : (
                <div className="profile-view">
                    <img src={avatar} alt="avatar" className="profile-avatar" />
                    <span className="profile-name">{username}</span>
                    <button onClick={() => setIsEditing(true)}>Modifier</button>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
