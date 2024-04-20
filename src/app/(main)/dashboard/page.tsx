"use client";

import React, { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { conAuth, conDatabase } from "@/config/firebase/firebaseConfig";
import Image from "next/image";
import {
  AtSign,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/config/firebase";

const DashboardPage = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = conAuth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        console.error("No user authenticated");
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(conDatabase, `users/${uid}`);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        setUserData(userDocSnapshot.data());
      } else {
        console.error("User document does not exist");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  return (
    <>
      {userData ? (
        <div className="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
          <div
            id="profile"
            className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0"
          >
            <div className="p-4 md:p-12 text-center lg:text-left">
              <h1 className="text-3xl font-bold pt-8 lg:pt-0">
                {userData.userFullName}
              </h1>
              <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
              {userData.userEmail && (
                <div className="flex items-center justify-center lg:justify-start pt-4 space-x-3">
                  <AtSign className="text-green-700" />
                  <p className="text-base font-bold "> {userData.userEmail}</p>
                </div>
              )}
              {userData.userOrganizationName && (
                <div className="flex items-center justify-center lg:justify-start pt-4 space-x-3">
                  <Building2 className="text-green-700" />
                  <p className="text-base font-bold ">
                    {userData.userOrganizationName}
                  </p>
                </div>
              )}
              {userData.userGradeLevel && (
                <div className="flex items-center justify-center lg:justify-start pt-4 space-x-3">
                  <GraduationCap className="text-green-700" />
                  <p className="text-base font-bold ">
                    {userData.userGradeLevel}
                  </p>
                </div>
              )}
              <p className="pt-8 text-sm">
                Totally optional short description about yourself, what you do
                and so on.
              </p>
              <div className="pt-4">
                <Button
                  onClick={handleLogout}
                  className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Sign Out.
                </Button>
              </div>
            </div>
          </div>
          <div className="w-2/5">
            <div
              style={{
                width: "300px",
                height: "300px",
              }}
            >
              <Image
                src={`${userData.pictureURL}`}
                alt={`${userData.userID}`}
                priority
                width={200}
                height={100}
                className="rounded-l-none rounded-lg shadow-2xl hidden lg:block"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default DashboardPage;
