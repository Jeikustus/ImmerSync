"use client";

import React, { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { conAuth, conDatabase } from "@/config/firebase/firebaseConfig";
import Image from "next/image";
import { AtSign, Building2, CircleUser, GraduationCap } from "lucide-react";
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

  return (
    <>
      {userData ? (
        <div className="max-w-4xl flex flex-col lg:flex-row items-center h-auto lg:h-screen mx-auto my-32 lg:my-0">
          <div
            id="profile"
            className="w-full rounded-lg lg:rounded-l-lg shadow-2xl bg-white opacity-95 mx-6 lg:mx-0"
          >
            <div className="p-6 md:p-12 text-center lg:text-left">
              <h1 className="text-3xl font-bold pt-8 lg:pt-0">
                {userData.userFullName}
              </h1>
              <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
              {userData.userEmail && (
                <div className="flex items-center justify-center lg:justify-start pt-4 space-x-3">
                  <AtSign className="text-green-700" />
                  <p className="text-base font-semibold">
                    {userData.userEmail}
                  </p>
                </div>
              )}
              {userData.userOrganizationName && (
                <div className="flex items-center justify-center lg:justify-start pt-2 space-x-3">
                  <Building2 className="text-green-700" />
                  <p className="text-base font-semibold">
                    {userData.userOrganizationName}
                  </p>
                </div>
              )}
              {userData.userGradeLevel && (
                <div className="flex items-center justify-center lg:justify-start pt-2 space-x-3">
                  <GraduationCap className="text-green-700" />
                  <p className="text-base font-semibold">
                    {userData.userGradeLevel}
                  </p>
                </div>
              )}
              {userData.userAccountType && (
                <div className="flex items-center justify-center lg:justify-start pt-2 space-x-3">
                  <CircleUser className="text-green-700" />
                  <p className="text-base font-semibold">
                    {userData.userAccountType}
                  </p>
                </div>
              )}
              {userData.userBio && (
                <p className="pt-6 text-sm">{userData.userBio}</p>
              )}
              <div className="pt-6 flex items-center space-x-3">
                <Button
                  onClick={() =>
                    (window.location.href = `user/${userData.userID}`)
                  }
                  className="border-2 border-green-700 bg-transparent hover:bg-green-900/50 hover:text-white text-green-700 font-semibold py-2 px-4 rounded-lg"
                >
                  Edit Account
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="w-56 h-56 bg-gray-200 rounded-full overflow-hidden shadow-lg">
              <Image
                src={`${userData.pictureURL}`}
                alt={`${userData.userID}`}
                priority
                width={300}
                height={300}
                className="rounded-full object-cover flex items-center justify-center"
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
