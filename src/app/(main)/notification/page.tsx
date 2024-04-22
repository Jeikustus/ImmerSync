"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { conAuth, conDatabase } from "@/config/firebase/firebaseConfig";
import { Bell, BriefcaseBusiness, CircleAlert, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

type jobAppliedType = {
  id: string;
  appliedBy: string;
  appliedByEmail: string;
  jobApplicationID: string;
  jobID: string;
  organizationName: string;
  studentsApplied: string[];
};

type jobPostedType = {
  id: string;
  jobTitle: string;
  jobID: string;
  jobAuthorEmail: string;
  jobAuthor: string;
  createdAt: { seconds: number; nanoseconds: number };
};

const NotificationPage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [jobPostedNotifications, setJobPostedNotifications] = useState<
    jobPostedType[]
  >([]);

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

  useEffect(() => {
    if (userData) {
      fetchJobPostedNotifications();
    }
  }, [userData]);

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

  const fetchJobPostedNotifications = async () => {
    try {
      const q = query(
        collection(
          conDatabase,
          "notification",
          "job-posted-notification/job-posted"
        )
      );
      const querySnapshot = await getDocs(q);
      const jobPostedType = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as jobPostedType[];
      setJobPostedNotifications(jobPostedType);
    } catch (error) {
      console.error("Error fetching job posted notifications:", error);
    }
  };

  return (
    <div>
      <h1>NOTIFICATION PAGE</h1>
      {userData && userData.userAccountType === "Teacher" && (
        <ul>
          {jobPostedNotifications.map((notification) => (
            <li key={notification.id}>
              <div
                id="toast-default"
                className="flex items-center max-w-[30%] p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                role="alert"
              >
                <div className="inline-flex items-center justify-center flex-shrink-0 w-20 h-20 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                  <BriefcaseBusiness />
                </div>
                <div className="ms-3 grid grid-cols-2 space-x-3">
                  <div>
                    <p className="font-bold text-3xl text-green-700">
                      {notification.jobTitle}
                    </p>
                    <p className="font-bold text-sm">
                      {notification.jobAuthor}
                    </p>

                    <p className="text-xs">
                      {new Date(
                        notification.createdAt.seconds * 1000
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                    <Button
                      onClick={() =>
                        (window.location.href = `jobs/find-job/details/${notification.jobID}`)
                      }
                      className="border-2 border-blue-700 bg-transparent hover:bg-blue-900/50 hover:text-white text-blue-700 font-semibold py-2 px-4 rounded-lg"
                    >
                      Open Job
                    </Button>
                  </div>
                </div>
                <Button
                  type="button"
                  className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                  data-dismiss-target="#toast-default"
                  aria-label="Close"
                >
                  <CircleX />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
