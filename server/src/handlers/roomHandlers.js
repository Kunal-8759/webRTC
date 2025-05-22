import { v4 as UUIDv4 } from "uuid";

//the below map stores for a rooms what all users have joined


const rooms = {};


const roomHandler = (socket) => {

    const createRoom = () => {
        const roomId = UUIDv4(); // Generate a unique room ID
        // create a new entry for the room
        rooms[roomId] = { presenter: socket.id, viewers: [] };

        socket.join(roomId); // Add the socket to the room

        socket.emit("room-created", { roomId }); // Notify the client that the room has been created
        console.log("Room created with id", roomId);

        console.log("rooms in createRoom", rooms);
    };

    //this function is called when a user(creator or joinee) joins a room

    const joinedRoom = ({ roomId }) => {

        const room = rooms[roomId];
        if (!room) return;
    
        room.viewers.push(socket.id); // Add the user to the room
        socket.join(roomId); // Add the socket to the room
        console.log("user added to room", rooms);

         console.log("rooms in joinedRoom", rooms);

        
        const presenterId = room.presenter;// Get the presenter socketID from the room
        socket.emit("presenter-info", {
            presenterSocketId: presenterId,
        });

        // Notify the presenter that a new user has joined
        socket.to(presenterId).emit("viewer-joined", { 
            viewerSocketId: socket.id,
        }); 
        
    };

    //send offer from presenter to viewer
    const sendOffer = ({ to, offer }) => {
    socket.to(to).emit("offer", { from: socket.id, offer });
    };

    //Answer from viewer to presenter
    const sendAnswer = ({ to , answer }) => {
        socket.to(to).emit("answer", { from: socket.id, answer }); 
    }

    //ice candidate exchange
    const sendIceCandidate = ({ to, candidate }) => {
        socket.to(to).emit("ice-candidate", { candidate, from: socket.id });
    };

    // Listen for events from the client
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
    socket.on("offer", sendOffer);
    socket.on("answer", sendAnswer);
    socket.on("ice-candidate", sendIceCandidate);
};

export default roomHandler;

