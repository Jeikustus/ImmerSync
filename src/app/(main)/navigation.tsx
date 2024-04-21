"use client";

import Link from "next/link";
import {
  BadgePlus,
  BellRing,
  CircleUserRound,
  CircleX,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareHeart,
  Search,
  ShieldEllipsis,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { conAuth, conDatabase } from "@/config/firebase/firebaseConfig";
import { logoutUser } from "@/config/firebase";
import { Button } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { userDataTypes } from "@/config/types";

export const NavigationBar = () => {
  const [user] = useAuthState(conAuth);
  const [userData, setUserData] = useState<userDataTypes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async (uid: string) => {
      try {
        const userDocRef = doc(conDatabase, `users/${uid}`);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userDataFromSnapshot = userDocSnapshot.data() as userDataTypes;
          setUserData(userDataFromSnapshot);
        } else {
          console.error("User document does not exist");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData(user.uid);
      setLoading(false);
    }
  }, [user]);

  const handleLogout = async () => {
    logoutUser();
    window.location.href = "/";
  };

  return (
    <nav className="shadow-md shadow-white bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-600 text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4">
        <div className="flex justify-center items-center space-x-5">
          <div className="font-bold text-3xl drop-shadow-lg">
            <span className="text-[#88AB8E] ">Immer</span>
            <span className="text-slate-500">Sync</span>
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-1 grid grid-cols-2 lg:grid-cols-4">
          <div className="flex justify-center items-center hover:bg-white hover:text-black hover:rounded-md">
            <LayoutDashboard />
            <Link href={"/dashboard"}>
              <Button variant={"ghost"}>Dashboard</Button>
            </Link>
          </div>
          <div className="flex justify-center items-center hover:bg-white hover:text-black hover:rounded-md">
            {loading ? (
              "Loading..."
            ) : (
              <>
                {userData?.userAccountType === "Admin" && (
                  <>
                    <ShieldEllipsis />
                    <Link href={"/admin"}>
                      <Button variant={"ghost"}>Admin</Button>
                    </Link>
                  </>
                )}
                {userData?.userAccountType === "Student" && (
                  <>
                    <MessageSquareHeart />
                    <Link href={"/feedback"}>
                      <Button variant={"ghost"}>Feedback</Button>
                    </Link>
                  </>
                )}
                {userData?.userAccountType === "Teacher" && (
                  <>
                    <Search />
                    <Link href={"/find-job"}>
                      <Button variant={"ghost"}>Find Job</Button>
                    </Link>
                  </>
                )}
                {userData?.userAccountType === "Organizer" && (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <div className="flex justify-center items-center hover:bg-white hover:text-black hover:rounded-md">
                          <BadgePlus />
                          <p className="px-1 text-md">Jobs</p>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <div className="flex justify-center items-center">
                            <BadgePlus />
                            <Link href={"/post-job"}>
                              <Button variant={"ghost"}>Post Job</Button>
                            </Link>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <div className="flex justify-center items-center">
                            <Search />
                            <Link href={"/job-view-feedback"}>
                              <Button variant={"ghost"}>View Feedback</Button>
                            </Link>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
                {(!userData ||
                  !["Student", "Teacher", "Organizer", "Admin"].includes(
                    userData.userAccountType
                  )) && (
                  <>
                    <CircleX />
                    <Link href={"/dashboard"}>
                      <Button variant={"ghost"}>Error</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex justify-center items-center hover:bg-white hover:text-black hover:rounded-md">
            <BellRing />
            <Link href={"/notification"}>
              <Button variant={"ghost"}>Notification</Button>
            </Link>
          </div>
          <div className="flex justify-center items-center hover:bg-white hover:text-black hover:rounded-md">
            <Mail />
            <Link href={"/chats"}>
              <Button variant={"ghost"}>Messages</Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center space-x-5 sm:col-span-2 lg:col-span-1">
          <div className="flex justify-center items-center">
            <div className="font-semibold">
              {user ? (
                <div className="flex justify-center items-center">
                  <CircleUserRound />
                  <p className="font-semibold">
                    <em>{user.email}</em>
                  </p>
                </div>
              ) : (
                <div className="flex justify-center items-center">
                  <CircleUserRound />
                  <p className="font-semibold">
                    <em>{` no users found: ${null}`}</em>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center justify-center space-y-1">
            <Button variant={"ghost"} size={"sm"} onClick={handleLogout}>
              <LogOut />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
