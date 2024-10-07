import express, { json, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, or specify your frontend's origin
    methods: ["GET", "POST"],
  },
});

// Store the current state of the canvas
let canvasState: CanvasState | null = null;

io.on("connection", (socket: Socket) => {
  console.log("A user connected:", socket.id);

  // When a new user connects, send them the current canvas state
  // if (canvasState) {
  //   socket.emit("updateCanvas", canvasState);
  // }

  socket.on("mouse_activity", (data) => {
    socket.broadcast.emit("all_mouse_activity", {
      session_id: socket.id,
      coords: data,
    });
  });

  // Listen for 'canvasChange' events from clients
  socket.on("canvasChange", (canvasJson) => {
    canvasState = canvasJson;
    console.log(canvasJson);

    // Broadcast the canvas state to other clients (except the sender)

    socket.broadcast.emit("updateCanvas", { canvasJson, sessionId: socket.id });
    console.log("updateCanvas emitted");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server on port 2020
server.listen(2020, () => {
  console.log("Server is running on http://localhost:2020");
});
