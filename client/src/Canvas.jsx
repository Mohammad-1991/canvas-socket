import * as fabric from "fabric";

import { io } from "socket.io-client"; // Importing Socket.IO client

import { useState, useRef, useEffect } from "react";

import { Box, Button } from "@mui/material";

import ZoomInOutFunctionality from "./fabric_manager/ZoomInOut";
import { addSquare, addCircle } from "./fabric_manager/Shapes";
import { handleImageDrop } from "./fabric_manager/DragAndDrop";
import { removeObjects } from "./fabric_manager/RemovingObjects";

import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Cancel from "@mui/icons-material/Cancel";
import { customizedDrawBroders } from "./utils/customizedDrawBorders";

const socket = io("http://localhost:2020"); // Adjust this to match your server address

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const ImageRef = useRef(null);
  const ImageRef2 = useRef(null);
  const [canvas, setCanvas] = useState(null);

  //Zoom In out Fucntion
  ZoomInOutFunctionality(canvas);

  // makes selection border rounded and lightgray
  customizedDrawBroders();

  useEffect(() => {
    // intializing the canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 400,
      cornerStyle: "circle",
    });
    // updateing the canvas state
    setCanvas(canvas);

    // we use these function to functionality to images for drag and drop
    handleImageDrop(canvasContainerRef, canvas, ImageRef, 0.3);
    handleImageDrop(canvasContainerRef, canvas, ImageRef2, 0.1);

    const emitCanvasChanges = () => {
      const canvasJson = canvas.toJSON();
      console.log("Emitting canvas state to server:", canvasJson); // Debugging log
      socket.emit("canvasChange", canvasJson); // Emit canvas state to server
      // return canvasJson;
    };
    // we use these canvas event listners to call the function canvasToJson to save canvas in json which is just currently loging the result to screen .
    canvas.on("object:modified", emitCanvasChanges);
    canvas.on("object:added", emitCanvasChanges);
    canvas.on("object:removed", emitCanvasChanges);

    socket.on("updateCanvas", (canvasJson) => {
      console.log("Received canvas update from server:", canvasJson);
    });

    // Cleanup on unmount
    return () => {
      canvas.dispose(); // Dispose the canvas
    };
  }, []);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      flexDirection={"column"}
      justifyContent={"center"}
      textAlign={"center"}
      backgroundColor={"lightgray"}
      gap={2}
    >
      <Box sx={{ backgroundColor: "white" }} ref={canvasContainerRef}>
        <canvas ref={canvasRef} style={{ border: "1px dotted gray" }}></canvas>
      </Box>
      <Box display={"flex"} gap={2}>
        <Button
          onClick={() => {
            addCircle(canvas);
          }}
          variant="outlined"
        >
          <CircleOutlinedIcon />
        </Button>
        <Button
          onClick={() => {
            addSquare(canvas);
          }}
          variant="outlined"
        >
          <SquareOutlinedIcon />
        </Button>
        <Button
          onClick={() => {
            canvas.clear();
          }}
          variant="outlined"
        >
          <DeleteForever />
        </Button>
        <Button
          onClick={() => {
            removeObjects(canvas);
          }}
          variant="outlined"
        >
          <Cancel />
        </Button>
        <img
          ref={ImageRef}
          draggable="true"
          src="/src/assets/img.jpg"
          alt="Image"
          style={{ height: 50, width: 50 }}
          className="Image"
        />
        <img
          ref={ImageRef2}
          draggable="true"
          src="/src/assets/logo.svg"
          alt="Image"
          style={{ height: 50, width: 50 }}
          className="Image"
        />
      </Box>
    </Box>
  );
};

export default CanvasComponent;
