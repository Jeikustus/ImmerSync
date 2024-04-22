"use client";

import React, { useEffect, useState } from "react";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { conAuth, conDatabase } from "@/config/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { InputWithLabel } from "@/components/ui/inputwithlabel";
import { InputAreaWithLabel } from "@/components/ui/inputAreaWitlabel";
import { CircleUser, Mail } from "lucide-react";

export default function ApplyPage() {
  const { jobID } = useParams<{ jobID: string }>();
  const [students, setStudents] = useState([{ name: "" }]);
  const [applicationLetter, setApplicationLetter] = useState("");
  const [success, setSuccess] = useState(false);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobDocRef = doc(conDatabase, "jobs", jobID);
        const jobSnapshot = await getDoc(jobDocRef);
        if (jobSnapshot.exists()) {
          setJobDetails(jobSnapshot.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobID]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const studentEmails = students.map((student) => student.name);
      const docRef = await addDoc(collection(conDatabase, "job-applications"), {
        jobID: jobID,
        studentsApplied: studentEmails,
        applicationLetter: applicationLetter,
        appliedAt: new Date().toISOString(),
        appliedBy: userData.userFullName,
        appliedByEmail: userData.userEmail,
      });
      console.log("Application submitted with ID: ", docRef.id);
      setSuccess(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setStudents([...students, { name: "" }]);
  };

  const handleStudentChange = (index: number, value: string) => {
    const updatedStudents = [...students];
    updatedStudents[index].name = value;
    setStudents(updatedStudents);
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Apply for Job</h1>
      {success ? (
        <div className="flex flex-col space-y-2">
          <p className="mb-4 text-green-500 font-bold">
            Application submitted successfully!
          </p>
          <div>
            <Button onClick={() => (window.location.href = "/jobs/find-job")}>
              Find more Jobs!
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="mb-4">Loading...</div>
          ) : jobDetails ? (
            <div className="mb-4">
              <h2 className="text-xl font-bold">{jobDetails.jobTitle}</h2>
              <p className="mb-2">
                Job Description: {jobDetails.jobDescription}
              </p>
              <div className="grid grid-rows-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <CircleUser />
                  <p className="font-bold text-lg">{jobDetails.jobAuthor}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail style={{ fontSize: "16px" }} />
                  <p className="text-sm">
                    <em>{jobDetails.createdByEmail}</em>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">Job details not found</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              {students.map((student, index) => (
                <InputWithLabel
                  label="Add Student"
                  key={index}
                  type="text"
                  value={student.name}
                  onChange={(e) => handleStudentChange(index, e.target.value)}
                  required
                  className="border-2 border-gray-300 rounded-lg p-2 w-full mb-2 text-black"
                />
              ))}
              <Button type="button" onClick={handleAddStudent}>
                Add Another Student
              </Button>
            </div>
            <div className="mb-4">
              <InputAreaWithLabel
                label="Application Letter"
                value={applicationLetter}
                onChange={(e) => setApplicationLetter(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="text-white px-4 py-2 rounded-lg"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
