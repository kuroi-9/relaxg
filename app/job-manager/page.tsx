import JobCard from "@/components/jobCard";
import { Key } from "react";

export async function getJobs() {
    try {
        //API is being rewriten, fetching its old state from gcloud run
        const data = await fetch(`http://${process.env.VPS_IP ?? process.env.DOCKER_GATEWAY_HOST!}:8082/jobs/`)
        //const data = await fetch(process.env.BACKEND_API_URL + "/jobs");
        //const data = await fetch('https://relax-api-190456347501.us-central1.run.app/jobs/')
        const jobs = await data.json();
        return jobs;
    } catch (error) {
        console.log('error: ' + error);
        return [];
    }
}

export default async function Page() {
    let jobs = await getJobs();

    return (
        <>
            <ul>
                {jobs.map((job: { id: Key | null | undefined; "title-name": string; "title-id": number }) => (
                    <JobCard key={job.id} job={job} host={process.env.VPS_IP ?? process.env.DOCKER_GATEWAY_HOST!} />
                ))}
            </ul>
        </>
    )
}