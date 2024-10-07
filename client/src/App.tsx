import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { io } from "socket.io-client"; // Updated import

const socket = io("http://localhost:2020");
console.log(socket.id);

const App: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas("canvas", {
      isDrawingMode: true,
    });
    canvasRef.current = fabricCanvas;

    // Listen for 'draw' events from the server
    socket.on("draw", (pathData: string) => {
      fabricCanvas.loadFromJSON(pathData);
    });

    // When the user draws, emit 'draw' event with path data
    fabricCanvas.on("mouse:dblclick", () => {
      console.log("dblckick");

      // const pathData = JSON.stringify(fabricCanvas.toJSON());
      const pathData = "JSON.stringify(fabricCanvas.toJSON());";
      socket.emit("draw", pathData);
    });

    return () => {
      socket.off("draw");
      fabricCanvas.dispose();
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 border-4 border-red-700">
      <canvas
        id="canvas"
        width={800}
        height={600}
        className="border border-gray-400 bg-white"
      />
    </div>
  );
};

export default App;
