import React from "react";
import ChatHeader from "./ChatHeader";
import Conversation from "./Conversation";

const ChatContainer = ({ owner, person, messages, lastMessageRef }) => {
  return (
    <div className="flex flex-col relative h-[700px] overflow-y-scroll bg-white">
      <div className="sticky top-0 left-0 w-full">
        <ChatHeader person={person} />
      </div>
      <Conversation
        messages={messages}
        user={owner}
        lastMessageRef={lastMessageRef}
      />
    </div>
  );
};

export default ChatContainer;
