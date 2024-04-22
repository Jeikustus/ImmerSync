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
import {
  Bell,
  BriefcaseBusiness,
  CircleAlert,
  CircleX,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

type jobAppliedType = {
  id: string;
  appliedBy: string;
  appliedByEmail: string;
  jobApplicationID: string;
  jobID: string;
  organizationName: string;
  jobTitle: string;
  studentsApplied: string[];
  createdAt: { seconds: number; nanoseconds: number };
};

type jobPostedType = {
  id: string;
  jobTitle: string;
  jobID: string;
  jobAuthorEmail: string;
  jobAuthor: string;
  createdAt: { seconds: number; nanoseconds: number };
};

type jobFeedbackType = {
  id: string;
  createdByPictureURL: string;
  feedback: string;
  jobID: string;
  jobTitle: string;
  studentEmail: string;
  studentName: string;
  jobAuthor: string;
  timestamp: { seconds: number; nanoseconds: number };
};

const NotificationPage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [jobPostedNotifications, setJobPostedNotifications] = useState<
    jobPostedType[]
  >([]);

  const [appliedJobNotifications, setappliedJobNotifications] = useState<
    jobAppliedType[]
  >([]);

  const [jobFeedbackNotification, setJobFeedbackNotification] = useState<
    jobFeedbackType[]
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
      fetchAppliedJobNotifications();
      fetchJobFeedbackNotifications();
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

  const fetchAppliedJobNotifications = async () => {
    try {
      const q = query(
        collection(
          conDatabase,
          "notification",
          "job-applied-notification/applied"
        )
      );
      const querySnapshot = await getDocs(q);
      const jobAppliedType = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as jobAppliedType[];
      setappliedJobNotifications(jobAppliedType);
    } catch (error) {
      console.error("Error fetching job posted notifications:", error);
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

  const fetchJobFeedbackNotifications = async () => {
    try {
      const q = query(
        collection(
          conDatabase,
          "notification",
          "job-feedback-notification/feedback"
        )
      );
      const querySnapshot = await getDocs(q);
      const jobFeedbackType = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as jobFeedbackType[];
      setJobFeedbackNotification(jobFeedbackType);
    } catch (error) {
      console.error("Error fetching feedback posted notifications:", error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-transparent mx-10">dw</h1>
      {userData && userData.userAccountType === "Teacher" && (
        <ul className="m-10 grid grid-cols-3">
          {jobPostedNotifications.map((notification) => (
            <li key={notification.id} className="m-2">
              <div
                id="toast-default"
                className="flex items-center p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                role="alert"
              >
                <div className="inline-flex items-center justify-center flex-shrink-0 w-20 h-20 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                  <BriefcaseBusiness />
                </div>
                <div className="ms-3 grid grid-cols-2 space-x-3 min-w-[25%]">
                  <div>
                    <p className="font-bold text-xl text-blue-700">
                      {notification.jobTitle}
                    </p>
                    <p className="font-bold text-sm">
                      <em className="text-xs font-mono">Posted By: </em>
                      {notification.jobAuthor}
                    </p>
                    <p className="text-xs">
                      {new Date(
                        notification.createdAt.seconds * 1000
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    (window.location.href = `jobs/find-job/details/${notification.jobID}`)
                  }
                  className="border-2 border-blue-700 bg-transparent hover:bg-green-900/50 hover:text-white text-green-700 font-semibold rounded-lg"
                >
                  Open Job
                </Button>
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
      {/* */}
      {userData && (
        <ul className="m-10 grid grid-cols-3">
          {appliedJobNotifications
            .filter((notification) =>
              notification.studentsApplied.includes(userData.userEmail)
            )
            .map((notification) => (
              <li key={notification.id} className="m-2">
                <div
                  id="toast-default"
                  className="flex items-center p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                  role="alert"
                >
                  <div className="inline-flex items-center justify-center flex-shrink-0 w-20 h-20 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    <Workflow />
                  </div>
                  <div className="ms-3 grid grid-cols-2 space-x-3 min-w-[25%]">
                    <div>
                      <p className="font-bold text-xl text-green-700">
                        {notification.jobTitle}
                      </p>
                      <p className="font-bold text-sm">
                        <em className="text-xs font-mono">Applied By: </em>
                        {notification.appliedBy}
                      </p>
                      <p className="text-xs">
                        {new Date(
                          notification.createdAt.seconds * 1000
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <Button
                      onClick={() => (window.location.href = `jobs/feedback`)}
                      className="border-2 border-green-700 bg-transparent hover:bg-green-900/50 hover:text-white text-green-700 font-semibold rounded-lg"
                    >
                      Open Job
                    </Button>
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
      {/*  */}
      {userData && (
        <ul className="m-10 grid grid-cols-3">
          {jobFeedbackNotification.map(
            (notification) =>
              userData.userEmail === notification.jobAuthor && (
                <li key={notification.id} className="m-2">
                  <div
                    id="toast-default"
                    className="flex items-center p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                    role="alert"
                  >
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-20 h-20 bg-red-100 rounded-lg dark:bg-red-800">
                      <Avatar>
                        <AvatarImage
                          src={`${notification.createdByPictureURL}`}
                          className="w-full h-full rounded-lg object-cover"
                        />
                        <AvatarFallback>{`${userData.userID}`}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="ms-3 grid grid-cols-2 space-x-3 min-w-[25%]">
                      <div>
                        <p className="font-bold text-xl text-red-700">
                          {notification.jobTitle}
                        </p>
                        <p className="font-bold text-sm">
                          <em className="text-xs font-mono">Feedback By: </em>
                          {notification.studentName}
                        </p>
                        <p className="text-xs">
                          {new Date(
                            notification.timestamp.seconds * 1000
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        (window.location.href = `jobs/view-feedback`)
                      }
                      className="border-2 border-red-700 bg-transparent hover:bg-red-900/50 hover:text-white text-red-700 font-semibold rounded-lg"
                    >
                      View Feedbacks
                    </Button>
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
              )
          )}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
