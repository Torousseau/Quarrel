import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/styles/HomePage.css";

export default function HomePage() {
    const user = JSON.parse(localStorage.getItem("user"))?.user;
    const [selectedServer, setSelectedServer] = useState(null);

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
                        <h1>Sélectionnez un serveur à gauche pour commencer</h1>
                    </div>
                )}
            </div>
        </div>
    );
}
