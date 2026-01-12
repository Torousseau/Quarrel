import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DefaultPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            navigate("/home");
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="fullscreen">
            Redirection en cours...
        </div>
    );
}
