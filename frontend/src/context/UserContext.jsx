import { useEffect, useState, createContext } from "react";
import { getAccessToken } from "../utils/GetAccesToken.js";

// Créer le contexte
export const UserContext = createContext(null);

export const UserProvider = ({ children, ip }) => {
    const storedUserId = localStorage.getItem("userId");
    const [userId] = useState(storedUserId ? parseInt(storedUserId) : null);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUser = async () => {
        if (!userId) return;
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`http://${ip}/api/user/profile/${userId}`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            if (!response.ok) throw new Error("Failed to fetch user");
            const data = await response.json();
            setUser(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    return (
        <UserContext.Provider value={{ user, setUser, fetchUser, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};
