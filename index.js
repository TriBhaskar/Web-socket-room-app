const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const port = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("client"));

io.on("connection", (socket) => {
  socket.emit("message", "Welcome to ChatCord!");

  //Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  //Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
});
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
