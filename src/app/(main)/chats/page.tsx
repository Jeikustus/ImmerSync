"use client"

import { ChatBox } from "./chatbox";
import { RecentChats } from "./recentchat";

const ChatPage = () => {
  

  return (
    <div className="background">
      <div className="flex space-x-5 p-5">
        <RecentChats />
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatPage;
