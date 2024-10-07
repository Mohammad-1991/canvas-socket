"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("./server"); // Adjust path if needed
let server;
beforeAll((done) => {
    server = server_1.server.listen(2020, done);
});
afterAll((done) => {
    server.close(done);
});
describe("Express Server", () => {
    test("should respond with 200 on GET /", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).get("/");
        expect(response.status).toBe(200);
    }));
});
describe("Socket.IO Events", () => {
    let clientSocket;
    let otherClientSocket;
    beforeAll((done) => {
        // Connect client socket to the server
        clientSocket = (0, socket_io_client_1.io)("http://localhost:2020");
        clientSocket.on("connect", done); // Wait until the connection is established
    });
    afterAll(() => {
        clientSocket.close();
        if (otherClientSocket)
            otherClientSocket.close();
    });
    test("should broadcast 'draw' event to other clients", (done) => {
        // Set up another client to listen for 'draw' event
        otherClientSocket = (0, socket_io_client_1.io)("http://localhost:2020");
        otherClientSocket.on("connect", () => {
            otherClientSocket.on("draw", (data) => {
                expect(data).toEqual({ x: 100, y: 200 });
                done(); // End the test once the assertion passes
            });
            // Emit 'draw' event from the first client
            clientSocket.emit("draw", { x: 100, y: 200 });
        });
    });
    test("should broadcast 'mousemove' event to other clients", (done) => {
        // Set up another client to listen for 'mousemove' event
        otherClientSocket = (0, socket_io_client_1.io)("http://localhost:2020");
        otherClientSocket.on("connect", () => {
            otherClientSocket.on("mousemove", (position) => {
                expect(position).toEqual({ x: 150, y: 250 });
                done(); // End the test once the assertion passes
            });
            // Emit 'mousemove' event from the first client
            clientSocket.emit("mousemove", { x: 150, y: 250 });
        });
    });
});
