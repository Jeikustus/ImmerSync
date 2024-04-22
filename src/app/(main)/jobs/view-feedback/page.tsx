"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
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

type JobDetails = {
  createdBy: string;
  createdByEmail: string;
  jobCategory: string;
  jobDescription: string;
  jobID: string;
  jobTitle: string;
  createdAt: { seconds: number; nanoseconds: number };
  jobAuthor: string;
  feedback: Feedback[];
};

type Feedback = {
  createdBy: string;
  createdByEmail: string;
  createdAt: { seconds: number; nanoseconds: number };
  feedback: string;
  jobID: string;
  studentName: string;
};

const ViewFeedBackPage = () => {
  const [jobDetailsList, setJobDetailsList] = useState<JobDetails[]>([]);
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
        if (userData && userData.userEmail) {
          const jobQuery = query(
            collection(conDatabase, "jobs"),
            where("createdByEmail", "==", userData.userEmail)
          );
          const jobSnapshot = await getDocs(jobQuery);
          if (!jobSnapshot.empty) {
            const jobDataList: JobDetails[] = jobSnapshot.docs.map(
              (doc) => doc.data() as JobDetails
            );
            setJobDetailsList(jobDataList);
          } else {
            console.log("No job found for the user!");
          }
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [userData]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const feedbackList: Feedback[] = [];
        for (const jobDetails of jobDetailsList) {
          const feedbackQuery = query(
            collection(conDatabase, "students-feedback"),
            where("jobID", "==", jobDetails.jobID)
          );
          const feedbackSnapshot = await getDocs(feedbackQuery);
          if (!feedbackSnapshot.empty) {
            feedbackSnapshot.forEach((doc) => {
              feedbackList.push(doc.data() as Feedback);
            });
          }
        }
        // Assign feedback to jobDetailsList
        setJobDetailsList((prevJobDetailsList) =>
          prevJobDetailsList.map((jobDetails) => ({
            ...jobDetails,
            feedback: feedbackList.filter(
              (feedback) => feedback.jobID === jobDetails.jobID
            ),
          }))
        );
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    if (jobDetailsList.length > 0) {
      fetchFeedback();
    }
  }, [jobDetailsList]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : jobDetailsList.length > 0 ? (
        <div className="m-10 flex flex-col space-y-5">
          {jobDetailsList.map((jobDetails, index) => (
            <Card className="" key={index}>
              <CardHeader>
                <CardTitle className="grid grid-cols-2">
                  <p className="font-bold">
                    &quot;
                    {jobDetails.jobTitle}
                    &quot;
                  </p>
                  <div className="flex flex-row-reverse text-sm space-x-2 text-blue-400 space-x-reverse">
                    <p>
                      Catergory: <em>{jobDetails.jobCategory}</em>
                    </p>
                  </div>
                </CardTitle>
                <div className="mx-auto  lg:mx-0 w-[10%] pt-3 border-b-2 border-green-500 opacity-25" />
                <CardDescription>{jobDetails.jobDescription}</CardDescription>
              </CardHeader>
              <CardContent>
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
                <div>
                  <h3 className="font-bold">Feedbacks:</h3>
                  <ul className="mt-4 space-y-4">
                    {jobDetails.feedback &&
                      jobDetails.feedback.map((feedback, idx) => (
                        <li
                          key={idx}
                          className="bg-gray-100 rounded-lg p-4 shadow-md"
                        >
                          <p className="text-lg font-semibold">
                            {feedback.feedback}
                          </p>
                          <p className="text-sm text-gray-500">
                            <em>
                              {feedback.studentName} -{" "}
                              {new Date(
                                feedback.createdAt.seconds * 1000
                              ).toLocaleString()}
                            </em>
                          </p>
                        </li>
                      ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2">
                <div className="text-gray-400 flex space-x-2">
                  <ClipboardCheck />
                  <p>
                    {new Date(
                      jobDetails.createdAt.seconds * 1000
                    ).toLocaleString()}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No job details available</p>
      )}
    </div>
  );
};

export default ViewFeedBackPage;
