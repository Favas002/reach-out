const express = require("express");
const dotenv = require("dotenv").config();
const ConnectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const colors = require("colors");
const chatRouter = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { Socket } = require("socket.io");
const path = require("path");
const cors = require("cors");

ConnectDB();
const app = express();
app.use(cors());
app.use(express.json()); //For server to accept json

// app.get("/", (req, res) => {
//   res.send("api is running");
// });

//Routes
app.use("/api/user/", userRoutes);
app.use("/api/chat/", chatRouter);
app.use("/api/message", messageRoutes);

//error handling midware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, (req, res) => {
  console.log(`Server started on port ${PORT}`.yellow.bold);
});

//*-------------------secket connection---------------------
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.UI_BASE_URL,
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io".magenta.italic.underline);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room:" + room);
  });
  // *for typing indicator
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
