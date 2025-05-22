import CreateRoom from "../Components/CreateRoom";

const Home = () => {

    const handleButtonClick = (e) => {
        e.preventDefault();
        const roomId = e.target.previousElementSibling.value.trim();

        if (roomId) {
            window.open(`${window.location.origin}/room/${roomId}`,'_blank');
        } else {
            alert("Please enter a room ID");
        }
    }

    return (<>
        <div className="h-[100vh] flex items-center justify-center ">
            <CreateRoom />
        </div>
        <div >
            <input
                type="text"
                placeholder="Enter room ID to join"
                className="border border-gray-300 rounded-md p-2 w-full max-w-xs"
                style={{
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    fontSize: "16px",
                    cursor: "pointer"
                }}
            />
            <button
                className="btn btn-secondary btn-lg btn-block"
                style={{
                    backgroundColor: "#4A90E2",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    fontSize: "16px",
                    cursor: "pointer"
                }}
                onClick={(e)=>{handleButtonClick(e)}}
            >Click to join room</button>
        </div>
    </>
        
    );
};

export default Home;
