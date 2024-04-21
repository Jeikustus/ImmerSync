"use client";

import { Button } from "@/components/ui/button";
import { InputAreaWithLabel } from "@/components/ui/inputAreaWitlabel";
import { InputWithLabel } from "@/components/ui/inputwithlabel";
import { conAuth, conDatabase } from "@/config/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { useState, useEffect } from "react";

const PostJobs = () => {
  const [userData, setUserData] = useState<any>(null);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [jobCategory, setJobCategory] = useState<string>("");

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

  const handlePostJob = async () => {
    try {
      if (!jobTitle || !jobDescription) {
        console.error("Job title and description are required.");
        return;
      }

      const jobData = {
        jobID: "",
        jobCategory: jobCategory,
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        jobAuthor: userData?.userFullName,
        createdBy: userData?.userID,
        createdByEmail: userData?.userEmail,
        createdAt: Timestamp.now(),
      };

      const jobsCollection = collection(conDatabase, "jobs");
      const docRef = await addDoc(jobsCollection, jobData);

      const jobID = docRef.id;

      const updatedJobData = {
        ...jobData,
        jobID: jobID,
      };

      await setDoc(doc(conDatabase, "jobs", jobID), updatedJobData);

      setJobCategory("");
      setJobTitle("");
      setJobDescription("");

      alert("Job posted successfully!");
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <div>
        <h1 className="text-3xl font-bold mb-4">POST JOB</h1>
      </div>
      <div>
        <InputWithLabel
          label="Job Category"
          className="text-black"
          placeholder="Enter job description"
          value={jobCategory}
          onChange={(e) => setJobCategory(e.target.value)}
          required
        />
        <InputWithLabel
          label="Job Title"
          type="text"
          className="text-black"
          placeholder="Enter Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />
        <InputAreaWithLabel
          label="Job Description"
          placeholder="Enter job description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
        />
        <Button onClick={handlePostJob} className="mt-4">
          Post Job
        </Button>
      </div>
    </div>
  );
};

export default PostJobs;
