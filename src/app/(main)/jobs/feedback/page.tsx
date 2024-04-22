"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { conAuth, conDatabase } from "@/config/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CircleUser, Mail, ClipboardCheck } from "lucide-react";
import { InputAreaWithLabel } from "@/components/ui/inputAreaWitlabel";

type JobApplication = {
  id: string;
  applicationLetter: string;
  appliedAt: string;
  appliedBy: string;
  appliedByEmail: string;
  jobID: string;
  studentsApplied: string[];
};

type JobDetails = {
  createdBy: string;
  createdByEmail: string;
  jobCategory: string;
  jobDescription: string;
  jobID: string;
  jobTitle: string;
  createdAt: { seconds: number; nanoseconds: number };
  jobAuthor: string;
};

const FeedBackPage = () => {
  const [appliedJobs, setAppliedJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);
  const [jobDetails, setJobDetails] = useState<JobDetails[]>([]);
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});

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
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(conDatabase, "job-applications"),
          where("studentsApplied", "array-contains", `${userData?.userEmail}`)
        );
        const querySnapshot = await getDocs(q);
        const jobsData: JobApplication[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as JobApplication[];
        setAppliedJobs(jobsData);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData && userData.userEmail) {
      fetchAppliedJobs();
    }
  }, [userData]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const jobDetailsPromises = appliedJobs.map(async (job) => {
          const jobDocRef = doc(conDatabase, "jobs", job.jobID);
          const jobSnapshot = await getDoc(jobDocRef);
          if (jobSnapshot.exists()) {
            return {
              id: job.jobID,
              details: jobSnapshot.data() as JobDetails,
            };
          } else {
            console.log("No such document for job ID:", job.jobID);
            return null;
          }
        });
        const jobDetailsData = await Promise.all(jobDetailsPromises);
        setJobDetails(
          jobDetailsData
            .filter((detail) => detail !== null && detail.details !== null)
            .map((detail) => detail!.details)
        );
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (appliedJobs.length > 0) {
      fetchJobDetails();
    }
  }, [appliedJobs]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return date.toLocaleString(undefined, options);
  }

  const handleFeedbackChange = (jobID: string, value: string) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [jobID]: value,
    }));
  };

  const handleFeedbackSubmit = async (jobID: string) => {
    try {
      setLoading(true);
      const feedbackText = feedback[jobID];
      if (feedbackText && feedbackText.trim() !== "") {
        await addDoc(collection(conDatabase, "students-feedback"), {
          jobID,
          feedback: feedbackText,
          studentEmail: userData?.userEmail,
          studentName: userData?.userFullName,
          timestamp: serverTimestamp(),
          createdAt: serverTimestamp(),
          createdByPictureURL: userData?.pictureURL,
        });
        alert("Feedback Sent Successfully!");
        setFeedback((prevFeedback) => ({
          ...prevFeedback,
          [jobID]: "",
        }));
      } else {
        console.error("Feedback is empty");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pt-5">
      {loading ? (
        <div>Loading...</div>
      ) : jobDetails.length > 0 ? (
        jobDetails.map((jobDetail) => (
          <div key={jobDetail.jobID} className="mb-4 p-5 w-full">
            <Card>
              <CardHeader>
                <CardTitle>
                  <p className="font-bold">{jobDetail.jobTitle}</p>
                  <div className="flex justify-end text-sm text-blue-400">
                    <p>
                      Category: <em>{jobDetail.jobCategory}</em>
                    </p>
                  </div>
                </CardTitle>
                <hr className="mx-auto w-[10%] pt-3 border-b-2 border-green-500 opacity-25" />
                <CardDescription>{jobDetail.jobDescription}</CardDescription>
                <hr className="mx-auto w-[10%] pt-3 border-b-2 border-green-500 opacity-25" />
              </CardHeader>
              <CardContent>
                <div className="bg-slate-100 rounded-lg">
                  {appliedJobs.length === 0 ? (
                    <p>No jobs found for the user</p>
                  ) : (
                    <ul>
                      {appliedJobs
                        .filter((job) => job.jobID === jobDetail.jobID)
                        .map((job) => (
                          <Card key={job.id} className="mb-4">
                            <CardHeader>
                              <CardTitle>
                                <p className="font-bold">{job.appliedBy}</p>
                                <p className="font-medium text-xs text-gray-400">
                                  Applied By
                                </p>
                              </CardTitle>
                              <CardDescription className="text-green-500 text-xs">
                                You have applied
                              </CardDescription>
                              <hr className="mx-auto w-full pt-3 border-b-2 border-green-500 opacity-25" />
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2">
                                <div>
                                  <div className="flex space-x-3 pb-2">
                                    <p className="font-medium text-gray-500">
                                      Applied At:
                                    </p>
                                    <p>{formatDate(job.appliedAt)}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-500">
                                      Applied Student:
                                    </p>
                                    <div className="rounded-md">
                                      {job.studentsApplied.map(
                                        (student, index) => (
                                          <p
                                            key={index}
                                            className="text-lg font-semibold"
                                          >
                                            {student}
                                          </p>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="w-full mb-4">
                                    <InputAreaWithLabel
                                      label="Enter Feedback"
                                      className="w-full"
                                      value={feedback[jobDetail.jobID] || ""}
                                      onChange={(e) =>
                                        handleFeedbackChange(
                                          jobDetail.jobID,
                                          e.target.value
                                        )
                                      }
                                      placeholder="What's in your mind?"
                                      required
                                    />
                                  </div>
                                  <Button
                                    className="w-full"
                                    onClick={() =>
                                      handleFeedbackSubmit(jobDetail.jobID)
                                    }
                                  >
                                    Send Feedback
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </ul>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="grid grid-cols-2">
                  <div className="grid grid-rows-2 text-gray-400">
                    <div className="flex items-center space-x-2">
                      <CircleUser />
                      <p className="font-bold text-lg">{jobDetail.jobAuthor}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail style={{ fontSize: "16px" }} />
                      <p className="text-sm">
                        <em>{jobDetail.createdByEmail}</em>
                      </p>
                    </div>
                    <div className="text-gray-400 flex space-x-2">
                      <ClipboardCheck />
                      <p>
                        {new Date(
                          jobDetail.createdAt.seconds * 1000
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2>Job ID: {jobDetail.jobID}</h2>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))
      ) : (
        <div>Job details not found</div>
      )}
    </div>
  );
};

export default FeedBackPage;
