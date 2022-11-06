import React, { useEffect, useRef } from "react";

const Conversation = ({ messages, user, lastMessageRef }) => {
  return (
    <div className="flex flex-col px-4">
      {!messages
        ? "Loading..."
        : messages.length > 0
        ? messages.map((m, idx) => (
            <div
              ref={lastMessageRef}
              className={
                m.sender == user.id
                  ? "self-end flex bg-blue-500 py-3 px-2 h-auto w-9/12 mb-2 rounded-md"
                  : "self-start flex bg-gray-500 py-3 px-2 h-auto w-9/12 mb-2 rounded-md"
              }
              key={idx}
            >
              <p className="text-white">{m.message}</p>
            </div>
          ))
        : "No last messages , let's start the conversation"}
    </div>
  );
};

export default Conversation;
