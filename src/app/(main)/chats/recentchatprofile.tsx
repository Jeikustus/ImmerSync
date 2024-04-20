import { CircleUser } from "lucide-react";

export const RecentChatProfile = () => {
  return (
    <div className="flex items-center space-x-3">
      <CircleUser className="w-10 h-10 rounded-full" />
      <div>
        <h2 className="text-lg font-semibold">John Doe</h2>
        <p className="text-gray-500">Hey there!</p>
      </div>
    </div>
  );
};
