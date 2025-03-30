import SocketManager from "@/app/components/jobs-manager/socketManager";
import { stackServerApp } from "@/stack";

export default async function JobsPage() {
    const user = await stackServerApp.getUser();
    const jobs = await fetch(
        `https://api${
            process.env.NEXT_ENV_MODE === "developpment" ? "-dev" : ""
        }.relaxg.app/jobs/`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-stack-access-token":
                    (await user
                        ?.getAuthJson()
                        .then((res) => res.accessToken)) ?? "",
            },
        }
    ).then((res) => res.json());

    if (jobs.error) {
        return (
            <section>
                <h1>{jobs.error}</h1>
            </section>
        );
    } else {
        return (
            <>
                <SocketManager
                    jobs={jobs}
                    host={
                        process.env.VPS_IP ?? process.env.DOCKER_GATEWAY_HOST!
                    }
                    dev={process.env.NEXT_ENV_MODE === "developpment"}
                />
            </>
        );
    }
}
