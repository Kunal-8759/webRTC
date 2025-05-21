/* eslint-disable react-refresh/only-export-components */
import SocketIoClient from "socket.io-client";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WS_Server = "http://localhost:5000";

// Creating a context without TypeScript typing
export const SocketContext = createContext(null);

const socket = SocketIoClient(WS_Server, {
    withCredentials: false,
    transports: ["polling", "websocket"]
});

export const SocketProvider = ({ children }) => {

    const navigate = useNavigate(); // Used to programmatically handle navigation

    useEffect(() => {
        const enterRoom = ({ roomId }) => {
            navigate(`/room/${roomId}`); 
        };

        // Listen for the "room-created" event from the server
        socket.on("room-created", enterRoom);
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
