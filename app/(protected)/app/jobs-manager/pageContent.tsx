export const fetchCache = "only-no-store";

import WebSocketParentContainer from "@/app/components/jobs-manager/webSocketParentContainer";
import { stackServerApp } from "@/stack";

/**
 *
 * @returns Returns the content data for the jobs page in a asynchronous way.
 */
export default async function JobsPageContent() {
    const user = await stackServerApp.getUser();
    const jobs = await fetch(
        `https://api${
            process.env.NEXT_ENV_MODE === "developpment" ? "-dev" : ""
        }.relaxg.app/jobs/`,
        {
            method: "GET",
            cache: "no-store",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-stack-access-token":
                    (await user
                        ?.getAuthJson()
                        .then((res) => res.accessToken)) ?? "",
            },
        },
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
                <WebSocketParentContainer
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
