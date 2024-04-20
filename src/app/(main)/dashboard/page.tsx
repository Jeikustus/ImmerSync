"use client";

import React, { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { conAuth, conDatabase } from "@/config/firebase/firebaseConfig";
import Image from "next/image";

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
    <div className="mx-auto max-w-lg p-4">
      {userData ? (
        <div className="bg-white shadow-md p-4 rounded-md">
          <h1 className="text-2xl font-bold mb-2">{userData.userFullName}</h1>
          <hr className="mb-2" />
          <p className="text-gray-700">
            Account Type: {userData.userAccountType}
          </p>
          {userData.userGradeLevel && (
            <p className="text-gray-700">
              Grade Level: {userData.userGradeLevel}
            </p>
          )}
          {userData.userOrganizationName && (
            <p className="text-gray-700">
              Organization Name: {userData.userOrganizationName}
            </p>
          )}
          {userData.userGradeLevel && (
            <div style={{ width: 100, height: 100 }}>
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/immersync-207b1.appspot.com/o/usersProfilePictures%2F9olHAMx28BctwlSN1rJMk7tuoT83%2FRaze%20Boombot?alt=media&token=961d331d-3a67-4d64-b5f1-9bad86ffa791"
                alt="log"
                priority
                width={100}
                height={100}
                // New syntax for responsive layout
                layout="fixed"
                // New syntax for objectFit
                objectFit="cover"
                // New syntax for objectPosition
                objectPosition="center"
              />
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DashboardPage;
