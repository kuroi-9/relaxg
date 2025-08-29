"use client";

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

    const handleRefresh = async (): Promise<void> => {
        setJobs(
            await fetch(
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
                },
            )
                .then((res) => res.json())
                .finally(() => {
                    console.log(
                        "[SocketContainer][Job refresh] Jobs fetch completed",
                    );
                }),
        );
    };

    useEffect(() => {
        console.dir("[SocketContainer] Current jobs list", jobs);
    }, [jobs]);

    return (
        <div>
            <JobsWrapper
                jobs={jobs}
                host={props.host}
                dev={props.dev}
                refresh={handleRefresh}
            />
        </div>
    );
}

export default WebSocketParentContainer;
