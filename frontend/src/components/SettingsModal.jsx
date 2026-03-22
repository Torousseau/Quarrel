import React, { useState, useEffect } from "react";
import "../assets/styles/SettingsModal.css";
import { getAccessToken } from "../utils/GetAccesToken.js";
import { useTheme } from "../context/ThemeContext";
import apiLink from "../config/ApiLink.js";

export default function SettingsModal({ isOpen, onClose, user, onUserUpdate }) {
    const [activeTab, setActiveTab] = useState("profile");
    const [language, setLanguage] = useState("fr");
    const [isEditing, setIsEditing] = useState(false);
    const { theme, setTheme } = useTheme();

    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [avatarFile, setAvatarFile] = useState(null);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setUsername(user?.username || "");
        setEmail(user?.email || "");
        setBio(user?.bio || "");
        setAvatar(user?.avatar || "");
        setAvatarFile(null);
        setIsEditing(false);
    }, [user]);

    useEffect(() => {
        const handleKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    if (!isOpen) return null;

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("bio", bio);
            if (avatarFile) formData.append("avatar", avatarFile);

            const response = await fetch(`${apiLink}/api/user/profile/update/`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${getAccessToken()}` },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const updatedUser = await response.json();
            onUserUpdate && onUserUpdate(updatedUser.user);
            setIsEditing(false);
        } catch {
            setError("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newAvatarURL = URL.createObjectURL(file);
            setAvatarFile(file);
            setAvatar(newAvatarURL);
            return () => URL.revokeObjectURL(newAvatarURL);
        }
    };

    const getAvatarSrc = () => {
        if (!avatar) return null;
        if (avatarFile) return avatar;
        // Si avatar commence par http ou https, retourne tel quel, sinon préfixe apiLink
        return avatar.startsWith("http") ? avatar : `${apiLink}${avatar}`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="settings-sidebar">
                    <h3 className="settings-title">User Settings</h3>
                    <button className={`settings-tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>Profile</button>
                    <button className={`settings-tab ${activeTab === "language" ? "active" : ""}`} onClick={() => setActiveTab("language")}>Language</button>
                    <button className={`settings-tab ${activeTab === "theme" ? "active" : ""}`} onClick={() => setActiveTab("theme")}>Theme</button>
                </div>

                <div className="settings-main">
                    {activeTab === "profile" && (
                        <div className="profile-tab">
                            <h2>Profile</h2>
                            <div className="profile-header">
                                {avatar ? (
                                    <img src={getAvatarSrc()} alt={username || "User avatar"} className="profile-avatar" />
                                ) : (
                                    <div className="profile-avatar-placeholder">{username?.charAt(0).toUpperCase() || "U"}</div>
                                )}

                                <div className="profile-info">
                                    <div className="profile-username">{username || "User"}</div>
                                    <div className="profile-email">{email || "user@email.com"}</div>
                                </div>

                                <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? "Cancel" : "Edit"}
                                </button>
                            </div>

                            {isEditing && (
                                <>
                                    <div className="settings-field">
                                        <label>Username</label>
                                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter new username" />
                                    </div>

                                    <div className="settings-field">
                                        <label>Email</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter new email" />
                                    </div>

                                    <div className="settings-field">
                                        <label>Bio</label>
                                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Enter your bio" />
                                    </div>

                                    <div className="settings-field">
                                        <label>Avatar</label>
                                        <input type="file" accept="image/*" onChange={handleAvatarChange} />
                                    </div>

                                    {error && <div className="error-msg">{error}</div>}

                                    <button className="save-btn" onClick={handleSaveProfile} disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save changes"}
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === "language" && (
                        <div className="language-tab">
                            <h2>Language</h2>
                            <div className="settings-field">
                                <label>Select your language</label>
                                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="de">Deutsch</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeTab === "theme" && (
                        <div className="theme-tab">
                            <h2>Theme</h2>
                            <div className="settings-field">
                                <label>Select your theme</label>
                                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <button className="close-btn" onClick={onClose}>×</button>
            </div>
        </div>
    );
}