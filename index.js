const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const formatMessage = require("./client/utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./client/utils/users");

const port = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("client"));
const botName = "ChatCord Bot";

//Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    console.log(username, room);
    const user = userJoin(socket.id, username, room);

    //Join user to room
    socket.join(user.room);
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  //Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      //Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
