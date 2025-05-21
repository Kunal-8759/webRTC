import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

const Room = () => {

    const { id } = useParams();
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        // Emitting this event so that the server knows someone joined the room
        socket.emit("joined-room", { roomId: id });
    }, []);

    return (
        <div>
            room : {id}
        </div>
    );
};

export default Room;
