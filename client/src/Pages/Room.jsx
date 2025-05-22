import { useEffect, useContext, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import UserFeedPlayer from "../Components/UserFeedPlayer";



const rtcConfig = {
  iceServers: [
    { urls: "stun:bn-turn1.xirsys.com" },

    {
    username: "AU6pvK1ENrYkbbPsMPVkpYmtyj1U3Ty7CImlAPMr-6tIjDNaWLpMeeni74FZ7I_yAAAAAGgsMftLdW5hbDg3NTk=",
    credential: "bc5d8384-354d-11f0-891d-0242ac140004",
    urls: [
        "turn:bn-turn1.xirsys.com:80?transport=udp",
        "turn:bn-turn1.xirsys.com:3478?transport=udp",
        "turn:bn-turn1.xirsys.com:80?transport=tcp",
        "turn:bn-turn1.xirsys.com:3478?transport=tcp",
        "turns:bn-turn1.xirsys.com:443?transport=tcp",
        "turns:bn-turn1.xirsys.com:5349?transport=tcp"
    ]
    }
  ],
};

const Room = () => {

    const { roomId } = useParams();
    const { socket , user , stream ,isPresenter} = useContext(SocketContext);
    const [remoteStreams, setRemoteStreams] = useState([]);
    const peersRef = useRef({});
    const presenterIdRef = useRef(null);
    const mySocketIdRef = useRef(null);

    //step -1 : join the room
    useEffect(() => {
       if( user && roomId){
         socket.emit("joined-room", { roomId });
       }
    }, [roomId,user,socket]);

    //step2 : get my socket iD
    useEffect(() => {
        socket.on("connect", () => {
        mySocketIdRef.current = socket.id;
        });
    }, []);

    // Step 3: Receive presenter info (only for viewers)
    useEffect(() => {
        socket.on("presenter-info", ({ presenterSocketId }) => {
        presenterIdRef.current = presenterSocketId;
        });
    }, []);

     // Step 4: Handle viewer-joined (only presenter)
    useEffect(() => {
        if (!stream) return;

        socket.on("viewer-joined", async ({ viewerSocketId }) => {
        if (mySocketIdRef.current !== socket.id) return; // Only presenter

        const peer = new RTCPeerConnection(rtcConfig);
        peersRef.current[viewerSocketId] = peer;

        stream.getTracks().forEach((track) => {
            peer.addTrack(track, stream);
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
            socket.emit("ice-candidate", {
                to: viewerSocketId,
                candidate: event.candidate,
            });
            }
        };

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        socket.emit("offer", {
            to: viewerSocketId,
            offer,
        });
        });
    }, [stream]);

    // Step 5: Handle incoming offer (only viewer)
    useEffect(() => {
        socket.on("offer", async ({ from, offer }) => {
        const peer = new RTCPeerConnection(rtcConfig);
        peersRef.current[from] = peer;

        peer.ontrack = (event) => {
            setRemoteStreams((prev) => [...prev, event.streams[0]]);
        };

        peer.onicecandidate = (event) => {
            if (event.candidate) {
            socket.emit("ice-candidate", {
                to: from,
                candidate: event.candidate,
            });
            }
        };

        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.emit("answer", { to: from, answer });
        });
    }, []);

    // Step 6: Handle answer (only presenter)
    useEffect(() => {
        socket.on("answer", async ({ from, answer }) => {
        const peer = peersRef.current[from];
        if (peer) {
            await peer.setRemoteDescription(new RTCSessionDescription(answer));
        }
        });
    }, []);

    // Step 7: Handle ICE candidates
    useEffect(() => {
        socket.on("ice-candidate", async ({ from, candidate }) => {
        const peer = peersRef.current[from];
        if (peer && candidate) {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
        }
        });
    }, []);

    return (
        <>
        
        {/* <div>
            <p>room : {roomId} </p>
            <p>user : {user} </p>

            <p>Local Stream</p>
            <UserFeedPlayer stream={stream} />
        </div>


        {remoteStreams.length > 0 && (
        <>
            <h4>Presenter Stream</h4>
            {remoteStreams.map((remote, i) => (
            <UserFeedPlayer key={i} stream={remote} />
            ))}
        </>
        )} */}

        <div>
  <p>Room: {roomId}</p>
  <p>User: {user}</p>

  {/* Only presenter shows their own camera */}
  { isPresenter && stream && (
    <>
      <p>🔴 You are the presenter</p>
      <UserFeedPlayer stream={stream} />
    </>
  )}
</div>

{!isPresenter && remoteStreams.length > 0 && (
  <>
    <h4>🔴 Live from Presenter</h4>
    {remoteStreams.map((remote, i) => (
      <UserFeedPlayer key={i} stream={remote} />
    ))}
  </>
)}




        </>
        
    );
};

export default Room;
