'use client'

import { Key, useEffect, useRef, useState } from "react";
import JobCard from "./jobCard";
import "@/app/globals.css"
import "@/app/(protected)/app/jobs-manager/jobsManager.css";

export interface VolumeItem {
    name: Key;
    treatedPagesCount: number;
    totalPagesCount: number;
    percentage: number | undefined;
    running: boolean;
    completed: boolean;
}

export interface TitleItem {
    id: Key
    name: string;
    volumes: VolumeItem[] | [];
    running: boolean | undefined;
}

export interface JobItem {
    id: Key;
    title: TitleItem;
    eta: number | undefined;
}

export default function SocketManager(props: {
    jobs: [{ id: Key | null | undefined; "title-name": string; "title-id": number }];
    host: string;
    dev: boolean;
}) {
    const websocket = useRef<WebSocket>(undefined);
    const websockets = useRef<WebSocket[]>([]);
    const websocketInterval = useRef<NodeJS.Timeout>();
    const websocketIntervals = useRef<NodeJS.Timeout[]>([]);
    const [jobsState, setJobsState] = useState<JobItem[] | []>([]);
    const jobsVolumes = useRef<Map<Key, VolumeItem[] | undefined>>(new Map());

    // Component global init/update stage
    if ((jobsState.length === 0 && props.jobs.length > 0) || jobsState.length !== props.jobs.length) {
        // Init global jobs state
        setJobsState(props.jobs.sort(function (a, b) {
            return -a.id!.toString()
                .localeCompare(b.id!.toString());
        }).map((job: { id: Key | null | undefined; "title-name": string; "title-id": number }) => (
            {
                id: job["id"]!,
                title: {
                    id: job["title-id"],
                    name: job["title-name"],
                    volumes: [],
                    running: undefined,
                },
                eta: undefined
            }))
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
    }

    /**
     * Meant to set the stop/resume button to a loading state, awaiting the server response
     * @param titleName 
     */
    const setJobRunningToUndefined = (titleName: string) => {
        setJobsState(() => {
            return jobsState.map((job) => {
                if (job.title.name === titleName) {
                    return (
                        {
                            ...job,
                            title: {
                                ...job.title,
                                running: undefined
                            }
                        }
                    )
                } else {
                    return job
                }
            })
        })

        jobsVolumes.current.set(titleName,
            jobsVolumes.current.get(titleName)!.map((item) => {
                return {
                    ...item,
                    running: false
                }
            }
            ));
    }

    /**
     * Reset the volumes entry of a designated title in the jobsVolumes map
     * @param titleName 
     */
    const resetTitleVolumesEntry = (titleName: string) => {
        // Resetting the running value on all volumes
        jobsVolumes.current.set(titleName, []);

        setJobsState(() => {
            return jobsState.map((job) => {
                if (job.title.name === titleName) {
                    return (
                        {
                            ...job,
                            title: {
                                ...job.title,
                                volumes: []
                            }
                        }
                    )
                } else {
                    return job
                }
            })
        })
    }

    /**
     * Refreshs the job lists, making deleted jobs disapear
     */
    const handleRefresh = () => {
        // router.refresh();
        // jobsVolumes.current.clear();
        // setJobsState(() => []);
        // websocket.current?.close();
        window.location.reload()
    }

    /**
     * Handle the core of the websocket connection trough API.
     * Handle the reconnection of the focus of the page is left.
     * @param websocketInRecursion 
     * @returns 
     */
    const websocketConnect = (websocketInRecursion: WebSocket) => {
        websocket.current = websocketInRecursion
        websocket.current.onclose = () => {
            console.log("SocketManager disconnected");
            if (window.location.pathname === "/app/jobs-manager") {
                websocketInterval.current = setInterval(() => {
                    if (websocketInRecursion && websocketInRecursion.readyState === 3) {
                        console.dir("[WEBSOCKET STATUS] Reconnecting...", window.location);
                        websocketInRecursion = new WebSocket(`wss://api${(props.dev) ? '-dev' : ''}.relaxg.app`);
                        websocketInRecursion.onopen = () => {
                            console.log("SocketManager connected");
                            console.log("[WEBSOCKET STATUS] Clearing interval...")
                            clearInterval(websocketInterval.current);
                            websocketConnect(websocketInRecursion);
                        }
                    }
                }, 3000)
                websocketIntervals.current.push(websocketInterval.current);
                websockets.current.push(websocket.current!)
            } else {
                console.log("Connection terminated.");
                return
            }
        }

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
            // Try getting current job
            const existingDefinedJobItem = jobsState.find((element) => element.title.name === titleName);
            if (!existingDefinedJobItem) {
                return;
            }

            // Updating job volumes ref
            let existingTitlesVolumesIndex: VolumeItem[] | undefined = jobsVolumes.current.get(titleName);
            if (existingTitlesVolumesIndex) {
                const existingVolume: VolumeItem | undefined = jobsVolumes.current.get(titleName)!
                    .find(element => element.name == currentVolumeName);
                if (!existingVolume) {
                    // Updating temp index
                    existingTitlesVolumesIndex.push(
                        {
                            name: currentVolumeName,
                            treatedPagesCount: (volumeNbPagesTreated - 3),
                            totalPagesCount: volumeNbTotalPages,
                            percentage: (volumeNbPagesTreated - 3) * 100 / volumeNbTotalPages,
                            running: volumeIsRunning,
                            completed: volumeIsCompleted
                        }
                    );

                    // Sorting temp index
                    existingTitlesVolumesIndex.sort(function (a, b) {
                        return a.name.toString()
                            .localeCompare(b.name.toString());
                    });

                    if (jobsState === undefined) return;
                } else {
                    // Updating temp volume and job objects if needed
                    if ((((volumeNbPagesTreated - 3) * 100 / volumeNbTotalPages) <= 100 && ((volumeNbPagesTreated - 3) * 100 / volumeNbTotalPages) >= 0)
                        && existingVolume.percentage !== (volumeNbPagesTreated - 3) * 100 / volumeNbTotalPages) {
                        existingVolume.percentage = (volumeNbPagesTreated - 3) * 100 / volumeNbTotalPages;
                        if (existingDefinedJobItem) {
                            existingDefinedJobItem.eta = volumeEtaTimestamp * 1000;
                            existingDefinedJobItem.title.running = isJobRunning(titleName);
                        }
                    }
                    existingVolume.running = volumeIsRunning;
                    existingVolume.completed = volumeIsCompleted;

                    // Updating temp index with the temp variable
                    existingTitlesVolumesIndex = existingTitlesVolumesIndex.map((item) => {
                        if (item.name === currentVolumeName) {
                            return existingVolume
                        } else {
                            return item
                        }
                    })

                    // Sorting temp index
                    existingTitlesVolumesIndex.sort(function (a, b) {
                        return a.name.toString()
                            .localeCompare(b.name.toString());
                    });
                }

                // Updating temp job variable with the temp volumes variable
                if (existingDefinedJobItem) {
                    existingDefinedJobItem!.title.volumes = existingTitlesVolumesIndex
                    existingDefinedJobItem!.title.running = isJobRunning(titleName);
                }


                // Updating jobVolumes global variable
                jobsVolumes.current.set(titleName, existingTitlesVolumesIndex);

                // Updating global job variable
                setJobsState(() => {
                    return jobsState.map((job) => {
                        if (job.title.name === titleName) {
                            return existingDefinedJobItem!
                        } else {
                            return job
                        }
                    })
                })
            } 
        }

        return
    }

    useEffect(() => {
        if (websocket.current === undefined) {
            websocketConnect(new WebSocket(`wss://api${(props.dev) ? '-dev' : ''}.relaxg.app`));
        }

        return () => {
            clearInterval(websocketInterval.current);
            websocket.current?.close();
            if (websocketIntervals.current !== undefined) {
                console.log("Component cleanup callback reached.")
                clearInterval(websocketInterval.current);
                for (const interval of websocketIntervals.current) {
                    clearInterval(interval);
                }
            }
            if (websockets.current !== undefined) {
                console.log("Component cleanup callback reached.")
                clearInterval(websocketInterval.current);
                for (const websocket of websockets.current) {
                    websocket.close();
                }
            }
            return;
        }
    }, [props.host, props.jobs]);

    //TODO: Find a better way to do this 
    //window.scrollTo(0, 0);

    return (
        <section className="flex flex-col items-center">
            <ul className="w-full">
                {jobsState.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        host={props.host}
                        setJobRunningToUndefined={setJobRunningToUndefined}
                        resetTitleVolumesEntry={resetTitleVolumesEntry}
                        dev={props.dev}
                        refresh={handleRefresh}
                    ></JobCard>
                ))}
            </ul>
        </section>
    )
}