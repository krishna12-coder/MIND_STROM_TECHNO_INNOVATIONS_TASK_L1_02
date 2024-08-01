const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log(socket.id); // x8WIv7-mJelg7on_ALbx

  socket.on("joinRoom", (room) => socket.join(room));

  socket.on("newMessage", ({ newMessage, room }) => {
    console.log(room, newMessage);
    io.in(room).emit("getLatestMessage", newMessage);
  });
});

app.get("/", (req, res) => {
  res.send("Socket chat BE Started.");
});

server.listen(8000, () => console.log("App started at port 8000"));
