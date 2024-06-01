const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const port = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("client"));

// app.get("/", (req, res) => {
//   res.send("<h1>Hello world</h1>");
// });

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
