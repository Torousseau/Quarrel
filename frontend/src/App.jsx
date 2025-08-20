import React, {useEffect, useState} from "react";
import Sidebar from "./components/Sidebar";
import ChannelList from "./components/ChannelList";
import ChatApp from "./pages/ChatPage";
import ProfileCard from "./components/ProfileCard";
import "./App.css";
import config from "../config.js";
import LoginPage from "./pages/LoginPage.jsx";

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [allChannels, setAllChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState(null);
   const [user] = useState(localStorage.getItem('userId'));

    useEffect(() => {
        if (isAuthenticated) {
            fetchChannels();
        }
    }, [isAuthenticated]);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const fetchChannels = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/user/${user}/channels`);
            const channels = await response.json();
            setAllChannels(channels);
        } catch (error) {
            console.error("Error fetching channels:", error);
            setAllChannels([]);
        }
    };

    return (
        <div className="app">
            {/*<Sidebar />*/}
            <ChannelList
                channels={allChannels}
                onSelect={setCurrentChannel}
                current={currentChannel}
            />
            <ChatApp channel={currentChannel} />
        </div>
    );
};

export default App;
