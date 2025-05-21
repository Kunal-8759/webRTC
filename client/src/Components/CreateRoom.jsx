import { useContext } from "react";
import { SocketContext } from "../context/SocketContext.jsx";

const CreateRoom = () => {

    const { socket } = useContext(SocketContext);

    const initRoom = () => {
        console.log("Initialising a req to create a room", socket);
        socket.emit("create-room");
    };

    return (
        <button 
            onClick={initRoom}
            className="btn btn-secondary btn-lg btn-block"
            style={{
                backgroundColor: "#4A90E2",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer"
            }} 
        >
            Start a new meeting in a new room
        </button>
    );
};

export default CreateRoom;
