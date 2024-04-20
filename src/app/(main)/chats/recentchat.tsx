import { RecentChatProfile } from "./recentchatprofile";

export const RecentChats = () => {
  return (
    <div className="min-w-[20%] bg-white rounded-lg shadow-md p-4">
      <h1 className="font-bold text-xl">CHAT HISTORY</h1>
      <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2 mb-4" />
      <div className="space-y-4">
        {/* Recent Chats Here */}
        <RecentChatProfile />
        <RecentChatProfile />
        <RecentChatProfile />
        <RecentChatProfile />
      </div>
    </div>
  );
};
