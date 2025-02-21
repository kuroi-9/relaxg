import JobCard from "@/components/jobCard";
import SocketManager from "@/components/socketManager";

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

export default async function JobsPage() {
    let jobs = await getJobs();

    return (
        <>
            <SocketManager jobs={jobs} host={process.env.VPS_IP ?? process.env.DOCKER_GATEWAY_HOST!} />
        </>
    )
}