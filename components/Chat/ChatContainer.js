import React from "react";
import ChatHeader from "./ChatHeader";
import Conversation from "./Conversation";

const ChatContainer = ({ owner, person, messages }) => {
  return (
    <div className="flex flex-col relative h-[700px] overflow-y-scroll bg-white">
      <ChatHeader person={person} />
      <Conversation messages={messages} user={owner} />
    </div>
  );
};

export default ChatContainer;
