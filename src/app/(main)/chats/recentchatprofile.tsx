import Image from "next/image";

type Props = {
  userPictureURL: string;
  userFullName: string;
  userID?: string;
  userEmail?: string;
  userAccountType?: string;
  userRecentChat: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const RecentChatProfile = ({
  userPictureURL,
  userFullName,
  userRecentChat,
  onClick,
}: Props) => {
  return (
    <div
      className="flex items-center bg-slate-100 rounded-md group hover:bg-green-100 cursor-pointer shadow-md hover:shadow-lg"
      onClick={onClick}
    >
      <div className="p-2 bg-gradient-to-r from-slate-300 to-slate-100 rounded-md rounded-r-none group-hover:rounded-r-none group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:to-green-100">
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden shadow-lg">
          <Image
            src={`${userPictureURL}`}
            alt={`${userFullName}'s profile picture`}
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
        </div>
      </div>
      <div className="pl-3">
        <h2 className="text-lg font-semibold">{userFullName}</h2>
        <p className="text-gray-500 truncate w-[200px] text-sm">
          {userRecentChat}
        </p>
      </div>
    </div>
  );
};
