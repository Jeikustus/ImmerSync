"use client";
import { useEffect, useState } from "react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { conDatabase } from "@/config/firebase/firebaseConfig";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClipboardCheck } from "lucide-react";

type Job = {
  id: string;
  jobTitle: string;
  jobDescription: string;
  jobCategory: string;
  jobID: string;
  createdAt: { seconds: number; nanoseconds: number };
};

const FindJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsCollection = collection(conDatabase, "jobs");

        let q = query(jobsCollection);
        if (searchTerm.trim() !== "") {
          q = query(jobsCollection, where("jobCategory", "==", searchTerm));
        }

        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <div>
        <h1 className="text-3xl font-bold mb-4">Find Jobs</h1>
        <Input
          type="text"
          placeholder="Search jobs"
          value={searchTerm}
          onChange={handleSearch}
          className="border-2 border-gray-300 rounded-lg p-2 mb-4 text-black"
        />
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {jobs.length === 0 ? (
              <p>No jobs found</p>
            ) : (
              <ul>
                {jobs.map((job) => (
                  <li key={job.id} className="mb-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>{job.jobTitle}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {job.jobDescription}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 mt-2">
                          Category: {job.jobCategory}
                        </p>
                      </CardContent>
                      <CardFooter className="grid grid-cols-2">
                        <div className="text-gray-400 flex space-x-2">
                          <ClipboardCheck />
                          <p>
                            {new Date(
                              job.createdAt.seconds * 1000
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-row-reverse space-x-2 space-x-reverse">
                          {" "}
                          <Button
                            onClick={() =>
                              (window.location.href = `find-job/details/${job.jobID}/apply`)
                            }
                          >
                            Quick Apply
                          </Button>
                          <Button
                            onClick={() =>
                              (window.location.href = `find-job/details/${job.jobID}`)
                            }
                            className="border-2 border-green-700 bg-transparent hover:bg-green-900/50 hover:text-white text-green-700 font-semibold py-2 px-4 rounded-lg"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindJobs;
