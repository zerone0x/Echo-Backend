const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FE_ORIGIN, process.env.FE_STG_ORIGIN],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["GET", "POST"],
  },
});
const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, app, server };
