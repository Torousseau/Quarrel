import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChannelList from "./components/ChannelList";
import ChatApp from "./pages/ChatPage";
import ProfileCard from "./components/ProfileCard";
import "./App.css";

const App = () => {
    const [currentChannel, setCurrentChannel] = useState("Xalker");

    return (
        <div className="app">
            {/*<Sidebar />*/}
            <ChannelList
                channels={["Xalker", "Zurglub"]}
                onSelect={setCurrentChannel}
                current={currentChannel}
            />
            <ChatApp channel={currentChannel} />
        </div>
    );
};

export default App;
