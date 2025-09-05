"use client";

import { Key, useEffect, useRef, useState } from "react";
import JobCard from "./jobCard";
import "@/app/globals.css";
import jobsWrapperStyles from "@/app/styles/jobs-manager/jobsManagerJobsWrapper.module.css";
import { VolumeItem, JobItem } from "@/app/interfaces/globals";

/**
 * Component that wraps and manages the display of job cards.
 * Receive continuously updates from the server via WebSocket and updates the job list accordingly.
 *
 * @param props - The properties passed to the component.
 * @param props.jobs - An array of job objects, each containing an id, title-name, and title-id.
 * @param props.jobsEta - A map of job names to their estimated time of arrival (ETA) in milliseconds.
 * @param props.host - The host URL for API requests.
 * @param props.dev - A boolean indicating whether the component is in development mode.
 * @param props.refreshAction - A function that refreshes the job list with the provided ETA map.
 * @returns The rendered JobsWrapper component.
 */
export default function JobsWrapper(props: {
    jobs: [
        {
            id: Key | null | undefined;
            "title-name": string;
            "title-id": number;
        },
    ];
    jobsEta: Map<string, number | undefined> | undefined;
    host: string;
    dev: boolean;
    refreshAction: (jobsEta: Map<string, number | undefined>) => Promise<void>;
}) {
    const websocket = useRef<WebSocket>(undefined);
    const websockets = useRef<WebSocket[]>([]);
    const websocketInterval = useRef<NodeJS.Timeout>();
    const websocketIntervals = useRef<NodeJS.Timeout[]>([]);
    const [jobsState, setJobsState] = useState<JobItem[] | []>([]);
    const jobsVolumes = useRef<Map<Key, VolumeItem[] | undefined>>(new Map());
    const [websocketReady, setWebsocketReady] = useState<boolean>(false);
    const [initialFetchCompleted, setInitialFetchCompleted] =
        useState<boolean>(false);

    // Component global init/update stage
    if (
        (jobsState.length === 0 && props.jobs.length > 0) ||
        jobsState.length !== props.jobs.length
    ) {
        // Init global jobs state
        setJobsState(
            props.jobs
                .sort(function (a, b) {
                    return -a.id!.toString().localeCompare(b.id!.toString());
                })
                .map(
                    (job: {
                        id: Key | null | undefined;
                        "title-name": string;
                        "title-id": number;
                    }) => ({
                        id: job["id"]!,
                        title: {
                            id: job["title-id"],
                            name: job["title-name"],
                            volumes: [],
                            running: undefined,
                        },
                        eta: props.jobsEta?.get(job["title-name"]) ?? undefined,
                        completed: undefined,
                    }),
                ),
        );

        // Init volumes hashmap with one entry for each title
        // At the moment, one job = one title, so we iterate trought jobs
        for (const job of props.jobs) {
            jobsVolumes.current.set(job["title-name"], []);
        }
    }

    /**
     * Updating the running status of a specific job
     * @param titleName
     * @returns
     */
    const isJobRunning = (titleName: string) => {
        for (const volume of jobsVolumes.current.get(titleName)!) {
            if (volume.running) return true;
        }

        return false;
    };

    /**
     * Refreshs the job lists, making deleted jobs disapear
     */
    const handleRefresh = () => {
        const loadingElement = document.getElementById(
            "jobs-wrapper-search-loading",
        );
        const contentContainer = document.getElementById(
            "jobs-wrapper-content-container",
        );
        if (loadingElement && contentContainer) {
            loadingElement!.style.zIndex = "50";
            loadingElement!.style.opacity = "1";
            contentContainer.style.opacity = "0";
        }

        setTimeout(() => {
            const jobsEta: Map<string, number | undefined> = new Map();
            for (const job of jobsState) {
                jobsEta.set(job.title.name, job.eta);
            }

            props.refreshAction(jobsEta);
        }, 500);
    };

    /**
     * Handle the core of the websocket connection trough API.
     * Handle the reconnection of the focus of the page is left, especially regarding mobiles.
     * @param websocketInRecursion
     * @returns
     */
    const websocketConnect = (websocketInRecursion: WebSocket) => {
        websocket.current = websocketInRecursion;
        websocket.current.onopen = () => {
            const contentContainer = document.getElementById(
                "jobs-wrapper-content-container",
            );
            const loadingElement = document.getElementById(
                "jobs-wrapper-search-loading",
            );
            setWebsocketReady(true);
            //console.log("[SocketManager][WEBSOCKET STATUS] Ready, initial fetch completed : ", initialFetchCompleted);

            setTimeout(
                () => {
                    if (contentContainer) {
                        contentContainer.style.visibility = "visible";
                        contentContainer.style.opacity = "1";
                    }
                    if (loadingElement) {
                        loadingElement!.style.opacity = "0";
                        setTimeout(() => {
                            loadingElement!.style.zIndex = "-1";
                        }, 500);
                    }
                    if (!initialFetchCompleted) {
                        setInitialFetchCompleted(true);
                    }
                },
                initialFetchCompleted ? 1000 : 2000,
            );
        };

        websocket.current.onclose = () => {
            setWebsocketReady(false);
            //console.log("[SocketManager][WEBSOCKET STATUS] Disconnected");
            if (window.location.pathname === "/app/jobs-manager") {
                websocketInterval.current = setInterval(() => {
                    // Until a new websocket.current is opened (readyState != 3), we try again
                    if (websocket.current?.readyState === 3) {
                        //console.dir("[SocketManager][WEBSOCKET STATUS] Reconnecting...", window.location);
                        websocketInRecursion = new WebSocket(
                            `wss://api${props.dev ? "-dev" : ""}.relaxg.app`,
                        );

                        setWebsocketReady(true);
                        clearInterval(websocketInterval.current);
                        websocketConnect(websocketInRecursion);
                    } else {
                        clearInterval(websocketInterval.current);
                    }
                }, 3000);
                websocketIntervals.current.push(websocketInterval.current);
                websockets.current.push(websocket.current!);
            } else {
                //console.log("[SocketManager] Websocket connection terminated.");
                return;
            }
        };

        websocket.current.onmessage = (event: MessageEvent) => {
            const eventData = JSON.parse(event.data);

            // Extracting data
            const titleName = eventData[0];
            const currentVolumeName = eventData[1];
            const volumeNbPagesTreated = Number(eventData[2]);
            const volumeNbTotalPages = Number(eventData[3]);
            const volumeIsRunning = Boolean(eventData[4] === "true");
            const volumeIsCompleted = Boolean(eventData[5] === "true");
            const volumeEtaTimestamp = Number(eventData[6]);
            const seriesCompleted = Boolean(eventData[7] === "true");
            const volumeDownloadLink = eventData[8];

            // Try getting current job
            const existingDefinedJobItem = jobsState.find(
                (element) => element.title.name === titleName,
            );
            if (!existingDefinedJobItem) {
                return;
            }

            // Updating job volumes ref
            let existingTitlesVolumesIndex: VolumeItem[] | undefined =
                jobsVolumes.current.get(titleName);
            if (existingTitlesVolumesIndex) {
                const existingVolume: VolumeItem | undefined =
                    jobsVolumes.current
                        .get(titleName)!
                        .find((element) => element.name == currentVolumeName);
                if (!existingVolume) {
                    // Updating temp index
                    existingTitlesVolumesIndex.push({
                        name: currentVolumeName,
                        treatedPagesCount: volumeNbPagesTreated - 3,
                        totalPagesCount: volumeNbTotalPages,
                        percentage:
                            ((volumeNbPagesTreated - 3) * 100) /
                            volumeNbTotalPages,
                        running: volumeIsRunning,
                        completed: volumeIsCompleted,
                        downloadLink: volumeDownloadLink,
                    });

                    // Sorting temp index
                    existingTitlesVolumesIndex.sort(function (a, b) {
                        return a.name
                            .toString()
                            .localeCompare(b.name.toString());
                    });

                    if (jobsState === undefined) return;
                } else {
                    // Updating temp volume and job objects if needed
                    if (
                        ((volumeNbPagesTreated - 3) * 100) /
                            volumeNbTotalPages <=
                            100 &&
                        ((volumeNbPagesTreated - 3) * 100) /
                            volumeNbTotalPages >=
                            0 &&
                        existingVolume.percentage !==
                            ((volumeNbPagesTreated - 3) * 100) /
                                volumeNbTotalPages
                    ) {
                        existingVolume.percentage =
                            ((volumeNbPagesTreated - 3) * 100) /
                            volumeNbTotalPages;
                        existingVolume.downloadLink = volumeDownloadLink;
                        if (existingDefinedJobItem) {
                            existingDefinedJobItem.eta =
                                volumeEtaTimestamp * 1000;
                            existingDefinedJobItem.title.running =
                                isJobRunning(titleName);
                            existingDefinedJobItem.completed = seriesCompleted;
                        }
                    }
                    existingVolume.running = volumeIsRunning;
                    existingVolume.completed = volumeIsCompleted;
                    existingVolume.downloadLink = volumeDownloadLink;

                    // Updating temp index with the temp variable
                    existingTitlesVolumesIndex = existingTitlesVolumesIndex.map(
                        (item) => {
                            if (item.name === currentVolumeName) {
                                return existingVolume;
                            } else {
                                return item;
                            }
                        },
                    );

                    // Sorting temp index
                    existingTitlesVolumesIndex.sort(function (a, b) {
                        return a.name
                            .toString()
                            .localeCompare(b.name.toString());
                    });
                }

                // Updating temp job variable with the temp volumes variable
                if (existingDefinedJobItem) {
                    existingDefinedJobItem!.title.volumes =
                        existingTitlesVolumesIndex;
                    existingDefinedJobItem!.title.running =
                        isJobRunning(titleName);

                    if (seriesCompleted) {
                        existingDefinedJobItem!.completed = true;
                    }
                }

                // Updating jobVolumes global variable
                jobsVolumes.current.set(titleName, existingTitlesVolumesIndex);

                // Updating global job variable
                setJobsState(() => {
                    return jobsState.map((job) => {
                        if (job.title.name === titleName) {
                            return existingDefinedJobItem!;
                        } else {
                            return job;
                        }
                    });
                });
            }
        };

        return;
    };

    useEffect(() => {
        if (websocket.current === undefined) {
            websocketConnect(
                new WebSocket(`wss://api${props.dev ? "-dev" : ""}.relaxg.app`),
            );
        }

        return () => {
            // Cleaning up websocket and intervals to avoid leakage
            clearInterval(websocketInterval.current);
            websocket.current?.close();
            if (websocketIntervals.current !== undefined) {
                for (const interval of websocketIntervals.current) {
                    clearInterval(interval);
                }
            }
            if (websockets.current !== undefined) {
                for (const websocket of websockets.current) {
                    websocket.close();
                }
            }
            websocket.current = undefined;
            return;
        };
    }, [props.host, props.jobs]);

    return (
        <section
            id="jobs-wrapper-section"
            className={jobsWrapperStyles["jobs-wrapper-section"]}
        >
            <h1 className="hidden text-lg font-semibold mb-4">
                WebSocket status @{" "}
                <span
                    className={
                        websocketReady ? "text-green-500" : "text-red-500"
                    }
                >
                    {websocketReady
                        ? ` Ready ${websocketIntervals.current.length}, ${websockets.current.length}`
                        : "Not Ready"}
                </span>
            </h1>
            <div
                id="jobs-wrapper-search-loading"
                className={`${jobsWrapperStyles["jobs-wrapper-search-loading"]} with-opacity-transition`}
            >
                <span
                    id="jobs-wrapper-search-loading-span"
                    className={
                        jobsWrapperStyles["jobs-wrapper-search-loading-span"] +
                        " big-loader-foreground"
                    }
                />
            </div>
            <ul
                id="jobs-wrapper-content-container"
                className={jobsWrapperStyles["jobs-wrapper-content-container"]}
            >
                {jobsState.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        host={props.host}
                        dev={props.dev}
                        refreshAction={handleRefresh}
                    />
                ))}
            </ul>
        </section>
    );
}
