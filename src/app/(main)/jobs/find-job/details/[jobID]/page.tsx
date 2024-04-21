"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { conDatabase } from "@/config/firebase/firebaseConfig";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AtSign, CircleUser, ClipboardCheck, Mail } from "lucide-react";

type Props = {
  params: {
    jobID: string;
  };
};

export default function JobDetails({ params: { jobID } }: Props) {
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div className="flex justify-center items-center pt-10">
      {loading ? (
        <div>Loading...</div>
      ) : jobDetails ? (
        <Card className="p-5 max-w-7xl">
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
          </CardContent>
          <CardFooter className="grid grid-cols-2">
            <div className="text-gray-400 flex space-x-2">
              <ClipboardCheck />
              <p>
                {new Date(jobDetails.createdAt.seconds * 1000).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-row-reverse space-x-2 space-x-reverse">
              <Button
                onClick={() =>
                  (window.location.href = `${jobDetails.jobID}/apply`)
                }
              >
                Apply Job
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <div>Job details not found</div>
      )}
    </div>
  );
}
