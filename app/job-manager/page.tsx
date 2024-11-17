import JobCard from "@/components/jobCard";
import {Key} from "react";

export default async function Page() {
    const data = await fetch('http://backend:8080/jobs/')
    const jobs = await data.json()

    return (
        <ul>
            {jobs.map((job: { id: Key | null | undefined; }) => (
                <JobCard key={job.id} job={job}/>
            ))}
        </ul>
    )
}