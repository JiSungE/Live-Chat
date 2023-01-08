const PORT = 3000;
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
const moment = require("moment");

app.use(express.static(path.join(__dirname, "src")));

io.on("connection", (socket) => {
  socket.on("Dictionary", (logkey) => {
    console.log(logkey);
  });
  socket.on("newuser", (newuser) => {
    console.log(`(${newuser})님이 접속하셨습니다.`);
    socket.newuser = newuser;
  });
  socket.on("chatting", (data) => {
    const { name, msg } = data;
    io.emit("chatting", {
      name,
      msg,
      time: moment(new Date()).format("h:mm A"),
    });
  });

  socket.on("forceDisconnect", () => {
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    if (!socket.newuser) {
      return;
    }
    console.log(`(${socket.newuser})님이 나가셨습니다.`);
    socket.broadcast.emit("update", {
      name: "SERVER",
      message: `님이 나가셨습니다.`,
    });
  });
});

server.listen(PORT, () => {
  console.log(`server start`);
});
