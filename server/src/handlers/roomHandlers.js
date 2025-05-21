import { v4 as UUIDv4 } from "uuid";

//the below map stores for a rooms what all users have joined
//  {1: [u1, u2, u3], 2: [u4,u5,u6]}
const rooms = {};


const roomHandler = (socket) => {

    const createRoom = () => {
        const roomId = UUIDv4(); // Generate a unique room ID
        socket.join(roomId); // Add the socket to the room

        // create a new entry for the room
        rooms[roomId]=[];

        socket.emit("room-created", { roomId }); // Notify the client that the room has been created
        console.log("Room created with id", roomId);
    };

    //this function is called when a user(creator or joinee) joins a room

    const joinedRoom = ({ roomId ,userId }) => {
        console.log("joined room called", rooms, roomId, userId);
        if(rooms[roomId]){
            rooms[roomId].push(userId); // Add the user to the room
            console.log("user added to room", rooms);
            socket.join(roomId); // Add the socket to the room
        }
    };

    // Listen for events from the client
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};

export default roomHandler;

