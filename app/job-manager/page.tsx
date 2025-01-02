import JobCard from "@/components/jobCard";
import {Key} from "react";

export default async function Page() {
    //API is being rewriten, fetching its old state from gcloud run
    const data = await fetch('http://backend:8080/jobs')
    //const data = await fetch('https://relax-api-190456347501.us-central1.run.app/jobs/')
    const jobs = await data.json()

    return (
        <ul>
            {jobs.map((job: { id: Key | null | undefined; "title-name": string; }) => (
                <JobCard key={job.id} job={job}/>
            ))}
        </ul>
    )
}