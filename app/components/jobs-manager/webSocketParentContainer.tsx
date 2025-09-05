"use client";
export const fetchCache = "only-no-store";

import { useUser } from "@stackframe/stack";
import { Key, useEffect, useState } from "react";
import JobsWrapper from "./jobsWrapper";

/**
 * Container component that manages jobs list data when needed
 * Fetches the latest list of jobs from the database (!= server)
 * Especially used for refreshing the jobs list when called
 *
 * @param props - The component props
 * @param props.jobs - Array of job objects containing id, title-name, and title-id
 * @param props.host - The host URL for WebSocket connections
 * @param props.dev - Boolean flag indicating development mode
 * @returns JSX element containing the JobsWrapper component
 */
function WebSocketParentContainer(props: {
    jobs: [
        {
            id: Key | null | undefined;
            "title-name": string;
            "title-id": number;
        },
    ];
    host: string;
    dev: boolean;
}) {
    const user = useUser();
    const [jobs, setJobs] = useState(props.jobs);
    const [jobsEta, setJobsEta] = useState<
        Map<string, number | undefined> | undefined
    >(undefined);

    const refreshAction = async (
        jobsEta: Map<string, number | undefined> | undefined,
    ): Promise<void> => {
        const newJobs = await fetch(
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

        setJobs(newJobs);
        setJobsEta(jobsEta);
        //console.dir("[SocketContainer][Job refresh] Jobs fetch completed");
        //console.log("[SocketContainer][Job refresh] ", newJobs, jobsEta);
    };

    useEffect(() => {
        refreshAction(undefined);
        //console.log("[SocketContainer] Jobs initial revalidation completed");
    }, []);
    /*
    useEffect(() => {
        console.dir("[SocketContainer] Current jobs list", jobs);
    }, [jobs]);
    */

    return (
        <div>
            <JobsWrapper
                jobs={jobs}
                jobsEta={jobsEta}
                host={props.host}
                dev={props.dev}
                refreshAction={refreshAction}
            />
        </div>
    );
}

export default WebSocketParentContainer;
