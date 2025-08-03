const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");     

const app = express();
const server = http.createServer(app);

// Allow requests from Next.js dev server
app.use(cors({ origin: "http://localhost:3000" }));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = {};
let userCount = 0;

io.on("connection", (socket) => {
  userCount++;
  io.emit("usercount", userCount);
  // Emit current online users to the newly connected client
  socket.emit("onlineUser", Object.keys(onlineUsers));
  console.log(`User connected: ${socket.id}`);

  socket.on("register", (username) => {
    onlineUsers[username] = socket.id;
    // Emit updated online users list to ALL clients
    io.emit("onlineUser", Object.keys(onlineUsers));
    console.log(`User registered: ${username} (${socket.id})`);
  });

  socket.on("private message", ({ to, message, from }) => {
    const targetSocketId = onlineUsers[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("private message", { message, from });
      console.log(`Private message from ${from} to ${to}: ${message}`);
    } else {
      console.log(`User ${to} not found`);
    }
  });

  socket.on("disconnect", () => {
    userCount--;
    io.emit("usercount", userCount);
    
    // Remove user from onlineUsers
    for (const [name, id] of Object.entries(onlineUsers)) {
      if (id === socket.id) {
        delete onlineUsers[name];
        console.log(`User ${name} disconnected`);
        break;
      }
    }
    io.emit("onlineUser", Object.keys(onlineUsers));
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
