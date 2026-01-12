import React, { useState } from "react";
import "../assets/styles/LoginPage.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erreur de connexion");
            }

            localStorage.setItem("user", JSON.stringify(data));

            if (onLogin) onLogin(data);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-fullscreen">
            <div className="decor decor-blue"></div>
            <div className="decor decor-indigo"></div>

            <div className="login-card-full">
                <h1 className="login-title">Connexion</h1>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Votre pseudo"
                        />
                    </div>

                    <div className="input-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`login-button ${loading ? "disabled" : ""}`}
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>
                <p className="login-footer">
                    Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
                </p>
            </div>
        </div>
    );
}