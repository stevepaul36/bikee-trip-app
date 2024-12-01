const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve a basic homepage
app.get("/", (req, res) => {
    res.send("Bike Trip Backend is running!");
});

// Real-time WebSocket communication
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Receive location from a rider
    socket.on("share-location", (data) => {
        io.emit("receive-location", data); // Broadcast to all users
    });

    // Receive a marker location
    socket.on("mark-location", (data) => {
        io.emit("new-marker", data); // Broadcast to all users
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
