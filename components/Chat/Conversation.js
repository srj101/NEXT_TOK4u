import axios from "axios";
import fileDownload from "js-file-download";
import React, { useEffect, useRef } from "react";

const Conversation = ({ messages, user, lastMessageRef }) => {
  const HandleDownload = (path, filename) => {
    const url = `/api/v1/chat/download?filepath=${path}`;
    let data = new FormData();
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };

  return (
    <div className="flex flex-col px-4">
      {!messages
        ? "Loading..."
        : messages.length > 0
        ? messages.map((m, idx) => (
            <div
              ref={lastMessageRef}
              className={
                Number(m.sender) == Number(user.id)
                  ? "self-end flex bg-blue-500 py-3 px-2 h-auto w-9/12 mb-2 rounded-md"
                  : "self-start flex bg-gray-500 py-3 px-2 h-auto w-9/12 mb-2 rounded-md"
              }
              key={idx}
            >
              <p className="text-white">{m.message}</p>
              {m.fileName ? (
                <p onClick={() => HandleDownload(m.path, m.fileName)}>
                  {m.fileName}
                </p>
              ) : (
                <span></span>
              )}
            </div>
          ))
        : "No last messages , let's start the conversation"}
    </div>
  );
};

export default Conversation;
