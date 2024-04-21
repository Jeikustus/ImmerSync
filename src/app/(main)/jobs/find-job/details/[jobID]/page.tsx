type Props = {
  params: {
    jobID: string;
  };
};

import React from "react";

export default function JobDetails({ params: { jobID } }: Props) {
  return <div>page{jobID}</div>;
}
