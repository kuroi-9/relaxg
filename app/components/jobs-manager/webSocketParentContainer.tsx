"use client";
export const fetchCache = "only-no-store";

import { Key } from "react";
import JobsWrapper from "./jobsWrapper";
import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";

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

    const handleRefresh = async (
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
        console.dir("[SocketContainer][Job refresh] Jobs fetch completed");
        console.log("[SocketContainer][Job refresh] ", newJobs, jobsEta);
    };

    useEffect(() => {
        handleRefresh(undefined);
        console.log("[SocketContainer] Jobs initial revalidation completed");
    }, []);

    useEffect(() => {
        console.dir("[SocketContainer] Current jobs list", jobs);
    }, [jobs]);

    return (
        <div>
            <JobsWrapper
                jobs={jobs}
                jobsEta={jobsEta}
                host={props.host}
                dev={props.dev}
                refresh={handleRefresh}
            />
        </div>
    );
}

export default WebSocketParentContainer;
