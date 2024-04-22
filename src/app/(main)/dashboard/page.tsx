"use client";

import React, { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { conAuth, conDatabase } from "@/config/firebase/firebaseConfig";
import Image from "next/image";
import { AtSign, Building2, CircleUser, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/config/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

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
        <div className="max-w-4xl mx-auto my-32 lg:my-0 pt-20">
          <div
            id="profile"
            className="w-full rounded-lg shadow-lg bg-white mx-6 lg:mx-0"
          >
            <div className="p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center">
                <div className="mb-8 lg:mb-0 lg:mr-8 flex-shrink-0">
                  <div className="w-32 h-32 bg-red-600 rounded-full overflow-hidden">
                    <Avatar>
                      <AvatarImage
                        src={`${userData.pictureURL}`}
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback>{`${userData.userID}`}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="mx-5 inline-block h-[250px] min-h-[1em] w-0.5 self-stretch bg-green-600 dark:bg-white/10"></div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    {userData.userFullName}
                  </h1>
                  {userData.userEmail && (
                    <div className="flex items-center space-x-2 text-gray-700 mb-2">
                      <AtSign className="h-5 w-5 text-green-600" />
                      <p className="text-base font-semibold">
                        {userData.userEmail}
                      </p>
                    </div>
                  )}
                  {userData.userOrganizationName && (
                    <div className="flex items-center space-x-2 text-gray-700 mb-2">
                      <Building2 className="h-5 w-5 text-green-600" />
                      <p className="text-base font-semibold">
                        {userData.userOrganizationName}
                      </p>
                    </div>
                  )}
                  {userData.userGradeLevel && (
                    <div className="flex items-center space-x-2 text-gray-700 mb-2">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                      <p className="text-base font-semibold">
                        {userData.userGradeLevel}
                      </p>
                    </div>
                  )}
                  {userData.userAccountType && (
                    <div className="flex items-center space-x-2 text-gray-700 mb-2">
                      <CircleUser className="h-5 w-5 text-green-600" />
                      <p className="text-base font-semibold">
                        {userData.userAccountType}
                      </p>
                    </div>
                  )}
                  {userData.userBio && (
                    <p className="text-gray-700 text-lg mb-6">
                      {userData.userBio}
                    </p>
                  )}
                  <div className="flex justify-center lg:justify-start">
                    <Button
                      onClick={() =>
                        (window.location.href = `user/${userData.userID}`)
                      }
                      className="border-2 border-green-700 bg-transparent hover:bg-green-700 hover:text-white text-green-700 font-semibold py-2 px-4 rounded-lg"
                    >
                      Edit Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center mt-8">Loading...</p>
      )}
    </>
  );
};

export default DashboardPage;
