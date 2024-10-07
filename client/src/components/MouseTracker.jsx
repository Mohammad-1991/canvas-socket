import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:2020"); // Adjust this to your server address

const MouseTracker = () => {
  const [otherMousePositions, setOtherMousePositions] = useState({});

  useEffect(() => {
    // Emit mouse position when mouse moves
    const handleMouseMove = (e) => {
      const coords = { x: e.pageX, y: e.pageY };
      socket.emit("mouse_activity", coords);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Listen for mouse movements from other clients
    socket.on("all_mouse_activity", (data) => {
      setMouseTracker(data);
    });
    // Listen for mouse movements from other clients

    const setMouseTracker = (data) =>
      setOtherMousePositions((prevPositions) => ({
        ...prevPositions,
        [data.session_id]: { x: data.coords.x - 10, y: data.coords.y - 12 },
      }));

    // Cleanup on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      socket.off("all_mouse_activity");
    };
  }, []);

  return (
    <div style={{ zIndex: 22 }}>
      <h3>Your mouse is being tracked!</h3>
      <p>{socket.id}</p>
      {Object.entries(otherMousePositions).map(([sessionId, coords]) => (
        <div
          key={sessionId}
          style={{
            position: "absolute",
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            backgroundColor: "red",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            fontSize: ".5rem",
          }}
        >
          {sessionId}
        </div>
      ))}
    </div>
  );
};

export default MouseTracker;
