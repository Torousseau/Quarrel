import {useState} from "react";
import { useNavigate } from "react-router-dom";
import {getAccessToken} from "../utils/GetAccesToken.js";

export default function CreateServer() {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://192.168.1.117:8000/api/server/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getAccessToken()}`
                },
                body: JSON.stringify({ name, description }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erreur de connexion");
            }

            navigate("/home");
        } catch (err) {
            setError(err.message);
        }

    }
    return (
        <div className="create-server-page">
            <h1>Create Server Page</h1>
            <p>This is where users can create a new server.</p>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                    <label>Server Name:</label>
                    <input
                        type="text"
                        placeholder="Enter server name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Server Description:</label>
                    <input
                        type="text"
                        placeholder="Enter server description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit">Create Server</button>
            </form>
        </div>
    );
}