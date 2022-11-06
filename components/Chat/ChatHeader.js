import { Avatar } from "antd";
import React from "react";

const ChatHeader = ({ person }) => {
  return (
    <div className="w-100 bg-green-500 py-4 px-3 mb-4 rounded-md">
      <div className="font-bold justify-start text-white flex gap-2 align-middle">
        <Avatar />
        <p className="m-0 text-lg">{person.name}</p>
      </div>
    </div>
  );
};

export default ChatHeader;
