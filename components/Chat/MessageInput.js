import { Button, Input, Upload } from "antd";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { UploadIcon } from "@heroicons/react/outline";
import axios from "axios";

let socket;
const MessageInputBOX = ({ onSend, messages, user, person }) => {
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(undefined);

  // const props = {
  //   action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  //   onChange({ file, fileList }) {
  //     if (file.status !== "uploading") {
  //       console.log(file);
  //       setFile(file);
  //     }
  //   },
  //   multiple: false,
  // };

  const sendMsg = async (e) => {
    e.preventDefault();
    await fetch("/api/socket");
    socket = io();
    if (!socket) {
      console.log("Socket not initialized... wait");
      return;
    }
    let frm = new FormData();
    frm.append("file", file);
    frm.append("msg", JSON.stringify({ msg, file }));
    frm.append("user", JSON.stringify(user));
    frm.append("person", JSON.stringify(person));
    frm.append("sender", JSON.stringify(user.id));
    const data = await axios.post("/api/v1/chat/sendMsg", frm, {
      headers: { "content-type": "application/json" },
    });
    const {
      data: { message },
    } = data;
    console.log(data);
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
    <form
      onSubmit={sendMsg}
      className="flex w-full items-center"
      encType="multipart/form-data"
    >
      <div className="basis-10/12">
        <Input
          type="text"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
      </div>

      <div className="basis-1/12 ">
        <Input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
            console.log(file);
          }}
          className="custom-file-input "
        />
      </div>

      <div>
        <Input type="submit" value="Send" />
      </div>
    </form>
  );
};

export default MessageInputBOX;
