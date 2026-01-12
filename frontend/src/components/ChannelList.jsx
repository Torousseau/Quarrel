import React from "react";
import "../assets/styles/ChannelsList.css";

const ChannelList = ({ channels, onSelect, current }) => {
    return (
        <div className="channel-list">
            <div className="channels">
                <div className="channels-header">
                    <h3>Channels</h3>
                </div>

                {channels.map((ch) => (
                    <button
                        key={ch.id}
                        className={`channel ${current?.id === ch.id ? "active" : ""}`}
                        onClick={() => onSelect(ch)}
                    >
                        # {ch.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChannelList;
