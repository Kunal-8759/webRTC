import { v4 as UUIDv4 } from "uuid";

const roomHandler = (socket) => {

    const createRoom = () => {
        const roomId = UUIDv4(); // Generate a unique room ID
        socket.join(roomId); // Add the socket to the room
        socket.emit("room-created", { roomId }); // Notify the client that the room has been created
        console.log("Room created with id", roomId);
    };

    const joinedRoom = ({ roomId }) => {
        console.log("New user has joined room", roomId);
    };

    // Listen for events from the client
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};

export default roomHandler;

