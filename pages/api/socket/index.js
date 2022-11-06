import { Server } from "socket.io";

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      //when connect
      console.log("a user connected." + socket.id);

      //take userId and socketId from user
      socket.on("addUser", (user) => {
        addUser(user, socket.id);
        io.emit("getUsers", users);
        console.log("user added----->", users);
      });

      //send and get message
      socket.on("sendMessage", ({ roomId, message }) => {
        console.log("msg recieved", { roomId, message });
        socket.join(roomId);
        io.to(roomId).emit("getMessage", {
          roomId,
          message,
        });
      });

      //when disconnect
      socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
      });
    });
  }
  res.end();
};

export default SocketHandler;
