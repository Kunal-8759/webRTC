import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

const Room = () => {

    const { id:roomId } = useParams();
    const { socket , user} = useContext(SocketContext);

    useEffect(() => {
        // Emitting this event so that the server knows someone joined the room
       if(user){
        // console.log("New user with id : ", user, " joined room : ", roomId);
         socket.emit("joined-room", { roomId , userId: user });
       }
    }, [roomId,user,socket]);

    return (
        <div>
            <p>room : {roomId} </p>
            <p>user : {user} </p>
        </div>
        
    );
};

export default Room;
