"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/inputwithlabel";
import { InputAreaWithLabel } from "@/components/ui/inputAreaWitlabel";
import { conAuth, conDatabase } from "@/config/firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Added setDoc import
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Added storage imports
import Image from "next/image";

type UserData = {
  userFullName: string;
  userEmail: string;
  userID: string;
  pictureURL: string;
  userAccountType: string;
  userOrganizationName?: string;
  userGradeLevel?: string;
  userAccountStatus: string;
  userBio?: string;
};

type Props = {
  params: {
    userID: string;
  };
};

export default function UserDetails({ params: { userID } }: Props) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [fullname, setFullName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [gradeLevel, setGradeLevel] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [selectPicture, setSelectPicture] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserData = async (userID: string) => {
      try {
        const userDocRef = doc(conDatabase, `users/${userID}`);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userDataFromSnapshot = userDocSnapshot.data() as UserData;
          setUserData(userDataFromSnapshot);
          setFullName(userDataFromSnapshot.userFullName);
          setBio(userDataFromSnapshot.userBio || "");
          setGradeLevel(userDataFromSnapshot.userGradeLevel || "");
          setOrganization(userDataFromSnapshot.userOrganizationName || "");
        } else {
          console.error("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const unsubscribe = conAuth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(userID);
      } else {
        console.error("No user authenticated");
        setUserData(null);
      }
    });

    return unsubscribe;
  }, [userID]);

  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedUserData: Partial<UserData> = {};
    const storage = getStorage();

    if (selectPicture) {
      const pictureRef = ref(
        storage,
        `usersProfilePictures/${userID}/${fullname}`
      );
      const fileBlob = new Blob([selectPicture], { type: selectPicture.type });

      try {
        await uploadBytes(pictureRef, fileBlob);
        const pictureURL = await getDownloadURL(pictureRef);
        updatedUserData.pictureURL = pictureURL;
      } catch (error) {
        console.error("Error uploading user picture:", error);
        setError("Failed to upload picture. Please try again.");
        return;
      }
    }

    if (fullname !== userData?.userFullName) {
      updatedUserData.userFullName = fullname;
    }

    if (bio !== userData?.userBio) {
      updatedUserData.userBio = bio;
    }

    if (organization !== userData?.userOrganizationName) {
      updatedUserData.userOrganizationName = organization;
    }

    if (gradeLevel !== userData?.userGradeLevel) {
      updatedUserData.userGradeLevel = gradeLevel;
    }

    try {
      const userDocRef = doc(conDatabase, `users/${userID}`);
      await setDoc(userDocRef, updatedUserData, { merge: true });
      alert("User data updated successfully");
      setUserData((prevUserData) => ({
        ...((prevUserData as UserData) || {}),
        ...updatedUserData,
      }));
    } catch (error) {
      console.error("Error saving user data:", error);
      setError("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {userData && (
        <>
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold mb-4">
                {userData.userFullName}
              </h1>
              <div className="flex flex-col space-y-2">
                <p>
                  <span className="font-bold">User ID:</span> {userData.userID}
                </p>
                <p>
                  <span className="font-bold">Email:</span> {userData.userEmail}
                </p>
                <p>
                  <span className="font-bold">Account Type:</span>{" "}
                  {userData.userAccountType}
                </p>
                {userData.userOrganizationName && (
                  <p>
                    <span className="font-bold">Organization:</span>{" "}
                    {userData.userOrganizationName}
                  </p>
                )}
                {userData.userGradeLevel && (
                  <p>
                    <span className="font-bold">Grade Level:</span>{" "}
                    {userData.userGradeLevel}
                  </p>
                )}
                <p>
                  <span className="font-bold">Account Status:</span>{" "}
                  {userData.userAccountStatus}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <form
              onSubmit={handleSaveChanges}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              <InputWithLabel
                label="Full Name"
                type="text"
                placeholder="Your full name"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <InputAreaWithLabel
                label="Bio"
                placeholder="Enter your bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
              {userData.userGradeLevel && (
                <InputWithLabel
                  label="Grade Level"
                  type="text"
                  placeholder="Enter grade level"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  required
                />
              )}
              {userData.userOrganizationName && (
                <InputWithLabel
                  label="Organization Name"
                  type="text"
                  placeholder="Enter organization name"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                />
              )}
              <div className="flex space-x-4">
                <Button
                  className="w-full"
                  onClick={() => (window.location.href = `user/reset`)}
                >
                  Reset Password
                </Button>
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <div>
              <Image
                src={userData.pictureURL}
                width={200}
                height={200}
                alt={userData.userFullName}
                className="rounded-full"
              />
              <InputWithLabel
                label="Select Picture"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectPicture(file);
                  }
                }}
                required
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
