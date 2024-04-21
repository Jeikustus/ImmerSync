"use client";

import { useState } from "react";
import { ChatBox } from "./chatbox";

const ChatPage = () => {
  const [searchEmail, setSearchEmail] = useState<string>("");

  return (
    <div className="background">
      <div className="">
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatPage;
