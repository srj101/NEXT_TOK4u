import { Input } from "antd";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;
const MessageInputBOX = ({ onSend, messages, user, person }) => {
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(undefined);

  const sendMsg = async () => {
    await fetch("/api/socket");
    socket = io();
    if (!socket) {
      console.log("Socket not initialized... wait");
      return;
    }
    const data = await fetch("/api/v1/chat/sendMsg", {
      method: "POST",
      body: JSON.stringify({
        msg: { msg, file },
        user,
        person,
        sender: Number(user.id),
      }),
      headers: { "content-type": "application/json" },
    });
    const { message } = await data.json();
    const room = user.email.concat(person.email).split("").sort().join("");
    socket.emit("sendMessage", {
      roomId: room,
      message: { msg, file },
      personEmail: person.email,
      userEmail: user.email,
    });
    onSend([...messages, message]);
    setMsg("");
    setFile(undefined);
  };

  return (
    <div className="flex">
      <Input type="text" onChange={(e) => setMsg(e.target.value)} value={msg} />
      <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <Input type="submit" onClick={sendMsg} value="Send" />
    </div>
  );
};

export default MessageInputBOX;
