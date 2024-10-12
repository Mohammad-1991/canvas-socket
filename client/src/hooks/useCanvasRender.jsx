import * as fabric from "fabric";
import { useEffect, useRef, useState } from "react";
import ZoomInOutFunctionality from "../fabric_manager/ZoomInOut";
import { customizedDrawBroders } from "../utils/customizedDrawBorders";
import { handleImageDrop } from "../fabric_manager/DragAndDrop";
import { io } from "socket.io-client"; // Importing Socket.IO client
import { addCircle, addSquare } from "../fabric_manager/Shapes";
import { applyGroupStyles } from "../fabric_manager/MultiSelectedControls";

const socket = io("http://localhost:2020"); // Adjust this to match your server address

export const useCanvasRender = () => {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const ImageRef = useRef(null);
  const ImageRef2 = useRef(null);
  const [canvas, setCanvas] = useState(null);

  // Zoom In/Out function
  ZoomInOutFunctionality(canvas);

  // Custom borders for selected objects
  customizedDrawBroders();

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 400,
      cornerStyle: "circle",
    });
    applyGroupStyles(canvas);
    // Update canvas state
    setCanvas(canvas);

    // Handle drag and drop for images
    handleImageDrop(canvasContainerRef, canvas, ImageRef, 0.3);
    handleImageDrop(canvasContainerRef, canvas, ImageRef2, 0.1);

    // Handle disconnection event
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    // Socket listener for receiving canvas updates from server
    socket.on("updateCanvas", (data) => {
      const { canvasJson } = data;
      // console.log(canvasJson);
    });

    // Handle disconnection event
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Modified emitCanvasChanges to accept external canvasJson
    const emitCanvasChanges = () => {
      const canvasJson = canvas.toJSON(); // Use external JSON if provided

      socket.emit("canvasChange", canvasJson); // Emit canvas state to server
    };

    // Listen to canvas events to emit changes
    canvas.on("object:modified", emitCanvasChanges);
    canvas.on("object:added", emitCanvasChanges);
    canvas.on("object:removed", emitCanvasChanges);
    // Handle disconnection event
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // Cleanup on unmount
    return () => {
      canvas.dispose();
      socket.off("updateCanvas");
    };
  }, []);

  const renderSquare = () => addSquare(canvas);
  const renderCircle = () => addCircle(canvas);

  return {
    canvasContainerRef,
    canvasRef,
    canvas,
    ImageRef,
    ImageRef2,
    renderSquare,
    renderCircle,
  };
};
