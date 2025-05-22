/* eslint-disable react-refresh/only-export-components */
 //the client side is responsible for creating the socket connection
//so when this page loads, we will create a socket connection to the server also create a new user id

import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid"; 


const WS_Server = "http://localhost:5000";

export const SocketContext = createContext(null);

// Create a new socket connection to the server
const socket = SocketIoClient(WS_Server, {
    withCredentials: false,
    transports: ["polling", "websocket"]
});

export const SocketProvider = ({ children }) => {

    // const navigate = useNavigate(); // Used to programmatically handle navigation

	const [user,setUser] = useState(null);
    const [stream, setStream] = useState();
    const [isPresenter, setIsPresenter] = useState(false);

    const fetchUserFeed = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true});
        setStream(stream);
    } 


    useEffect(() => {

		const userID = uuidV4(); // Generate a unique user ID
		setUser(userID); // Set the user ID in state


        const enterRoom = ({ roomId }) => {
            setIsPresenter(true); // Set the user as presenter
            fetchUserFeed(); // Fetch the user feed when entering the room
            window.open(`${window.location.origin}/room/${roomId}`, '_blank');
            // navigate(`/room/${roomId}`); 
        };

        // Listen for the "room-created" event from the server
        socket.on("room-created", enterRoom);
    }, []);

    return (
        <SocketContext.Provider value={{ socket, user , stream , isPresenter}}>
            {children}
        </SocketContext.Provider>
    );
};
