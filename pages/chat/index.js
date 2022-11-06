import dynamic from "next/dynamic";
import React, { useLayoutEffect } from "react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import MessageInput from "../../components/Chat/MessageInput";

const ChatUsers = dynamic(() => import("../../components/Chat/ChatUsers"), {
  ssr: false,
});
const ChatContainer = dynamic(
  () => import("../../components/Chat/ChatContainer"),
  {
    ssr: false,
  }
);
let socket;
const Chat = ({ users, msgs }) => {
  const { data: session } = useSession();

  const [messages, setMessages] = useState(msgs);

  useEffect(() => socketInitializer(), [selectedPerson]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
      socket.emit("addUser", session.user.email);
    });

    socket.on("getUsers", (users) => {
      console.log("online-->", users);
    });
  };

  const [selectedPerson, setSelectedPerson] = useState(users[0]);

  async function fetchConversetion(personEmail, userEmail) {
    // console.log(personEmail, userEmail);
    await fetch("/api/socket");
    socket = io();

    socket.on("connection", (socket) => {
      const room = session.user.email
        .concat(selectedPerson.email)
        .split("")
        .sort()
        .join("");

      socket.join(room);

      socket.on("getMessage", (msges) => {
        console.log("msges-->", msges);
      });

      console.log("joined room");
    });

    const data = await fetch(`/api/v1/chat/${personEmail}`, {
      method: "POST",
      body: JSON.stringify({
        userEmail,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    const { messages } = await data.json();
    setMessages(messages);
    return messages;
  }

  useEffect(() => {
    // console.log(selectedPerson);
    fetchConversetion(selectedPerson.email, session.user.email);
  }, [selectedPerson]);

  useEffect(() => {
    setMessages(messages);
    // console.log(messages);
  }, [messages.length]);

  return (
    <div className="flex h-full">
      <div className="basis-8/12">
        {users.length > 0 ? (
          <div className="flex flex-col min-h-screen px-8 border-r-2">
            <div>
              <ChatContainer
                owner={session.user}
                person={selectedPerson}
                messages={messages}
              />
            </div>
            <div className=" w-full h-16 px-8">
              <MessageInput
                onSend={setMessages}
                messages={messages}
                user={session.user}
                person={selectedPerson}
              />
            </div>
          </div>
        ) : (
          "No One to Chat..."
        )}
      </div>
      <div className="basis-4/12 px-4">
        <ChatUsers users={users} selectedPerson={setSelectedPerson} />
      </div>
    </div>
  );
};

export default Chat;

export async function getServerSideProps({ req, res }) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const data = await fetch(`${process.env.BASE_URL}/api/v1/users/all`);
  let { users } = await data.json();

  if (!token) {
    return {
      props: { users: [], msgs: [] },
    };
  }

  users = users.filter((item) => item.email !== token.email);

  const d = await fetch(
    `${process.env.BASE_URL}/api/v1/chat/${users[0].email}`,
    {
      method: "POST",
      body: JSON.stringify({
        userEmail: token.email,
      }),
      headers: {
        "content-type": "application/json",
      },
    }
  );

  const { messages } = await d.json();

  return {
    props: { users: users, msgs: messages },
  };
}
