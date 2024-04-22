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

type Notification = {
  id: string;
  jobAuthor: string;
  jobTitle: string;
  jobDescription: string;
  jobCategory: string;
  jobLocation: string;
  jobDate: string;
  jobTime: string;
  jobID: string;
  createdAt: { seconds: number; nanoseconds: number };
  jobAuthorEmail: string;
  jobAuthorName: string;
  jobAuthorID: string;
  jobAuthorPhotoURL: string;
  jobAuthorBio: string;
};

const NotificationPage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [jobAppliedNotifications, setJobAppliedNotifications] = useState<
    Notification[]
  >([]);
  const [jobFeedbackNotifications, setJobFeedbackNotifications] = useState<
    Notification[]
  >([]);
  const [jobPostedNotifications, setJobPostedNotifications] = useState<
    Notification[]
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
      fetchJobAppliedNotifications();
      fetchJobFeedbackNotifications();
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

  const fetchJobAppliedNotifications = async () => {
    try {
      const q = query(
        collection(
          conDatabase,
          "notification",
          "job-applied-notification/applied"
        ),
        where("student", "==", userData.userEmail)
      );
      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setJobAppliedNotifications(notifications);
    } catch (error) {
      console.error("Error fetching job applied notifications:", error);
    }
  };

  const fetchJobFeedbackNotifications = async () => {
    try {
      const q = query(
        collection(
          conDatabase,
          "notification",
          "job-feedback-notification/feedback"
        ),
        where("organizerAccount", "==", userData.userEmail)
      );
      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setJobFeedbackNotifications(notifications);
    } catch (error) {
      console.error("Error fetching job feedback notifications:", error);
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
      const notifications = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setJobPostedNotifications(notifications);
    } catch (error) {
      console.error("Error fetching job posted notifications:", error);
    }
  };

  return (
    <div>
      <h1>NOTIFICATION PAGE</h1>
      <h2>Job Applied Notifications</h2>
      <ul>
        {jobAppliedNotifications.map((notification) => (
          <li key={notification.id}>
            {/* Render notification details here */}
          </li>
        ))}
      </ul>
      <h2>Job Feedback Notifications</h2>
      <ul>
        {jobFeedbackNotifications.map((notification) => (
          <li key={notification.id}>
            {/* Render notification details here */}
          </li>
        ))}
      </ul>
      <h2>Job Posted Notifications</h2>
      {userData && userData.userAccountType === "Teacher" && (
        <ul>
          {jobPostedNotifications.map((notification) => (
            <li key={notification.id}>
              <h3>Job Posted Notification</h3>
              <p>
                <strong>Job Author:</strong> {notification.jobAuthor}
              </p>
              <p>
                <strong>Job Author Email:</strong> {notification.jobAuthorEmail}
              </p>
              <p>
                <strong>Job ID:</strong> {notification.jobID}
              </p>
              <p>
                <strong>Job Title:</strong> {notification.jobTitle}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(
                  notification.createdAt.seconds * 1000
                ).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
