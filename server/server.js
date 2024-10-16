const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
const roomUsers = {}; // Track users in each room

// Utility function to get all connected clients in a room
const getAllConnectedClients = (roomID) => {
  return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map(
    (socketID) => ({
      socketId: socketID,
      username: userSocketMap[socketID],
    })
  );
};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Handle user joining the room
  // Handle user joining the room
  socket.on("join", ({ roomID, username }) => {
    userSocketMap[socket.id] = username; // Store the username for this socket
    socket.join(roomID);

    const clients = getAllConnectedClients(roomID);

    // Notify all existing clients in the room about the new user
    socket.to(roomID).emit("newUserJoined", { username });

    // Send the updated client list to all clients in the room
    io.to(roomID).emit("updatedClients", clients);

    // Send the updated client list to the new user
    socket.emit("joined", { clients });
  });
  // Handle user disconnecting
  socket.on("disconnecting", () => {
    const username = userSocketMap[socket.id];
    const rooms = Array.from(socket.rooms); // Get the rooms the user was in
    rooms.forEach((roomID) => {
      if (roomUsers[roomID]) {
        socket.to(roomID).emit("disconnected", { username });
        // Remove the user from the room's user set
        roomUsers[roomID].delete(username);

        // Update clients in the room after a user disconnects
        const clients = getAllConnectedClients(roomID);
        io.to(roomID).emit("updatedClients", clients);
      }
    });
    delete userSocketMap[socket.id]; // Cleanup
  });

  //code editior :
  socket.on("codeUpdate", (code) => {
    // Emit the code update to all clients in the room except the sender
    socket.broadcast.emit("codeUpdate", code);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
