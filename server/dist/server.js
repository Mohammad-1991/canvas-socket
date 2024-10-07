"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Allow all origins, or specify your frontend's origin
        methods: ["GET", "POST"],
    },
});
// Store the current state of the canvas
let canvasState = null;
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    // When a new user connects, send them the current canvas state
    // if (canvasState) {
    //   socket.emit("updateCanvas", canvasState);
    // }
    // Listen for 'canvasChange' events from clients
    socket.on("canvasChange", (canvasJson) => {
        console.log("canvasChanged", canvasJson);
        canvasState = canvasJson;
        // Broadcast the canvas state to other clients (except the sender)
        socket.broadcast.emit("updateCanvas", canvasJson);
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
