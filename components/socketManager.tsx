'use client'

import { Key, useEffect, useRef, useState } from "react";
import JobCard from "./jobCard";

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
}) {
    const websocket = useRef<WebSocket | undefined>();
    const [jobsState, setJobsState] = useState<JobItem[] | []>([]);
    const jobsVolumes = useRef<Map<Key, VolumeItem[] | undefined>>(new Map());

    console.log("[REBUILD]", jobsState, jobsVolumes.current);

    if (jobsState.length === 0) {
        console.log("[INIT jobState]")
        // Init global jobs state
        setJobsState(props.jobs.map((job: { id: Key | null | undefined; "title-name": string; "title-id": number }) => (
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
        console.log("[INIT] jobsVolumes.current")
        for (const job of props.jobs) {
            jobsVolumes.current.set(job["title-name"], []);
        }
    }

    const isJobRunning = (titleName: string) => {
        for (const volume of jobsVolumes.current.get(titleName)!) {
            if (volume.running) return true;
        }

        return false;

    }

    // Meant to set the stop/resume button to a loading state, awaiting the server response
    const setJobRunningToUndefined = (titleName: string) => {
        setJobsState((prevState) => {
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

    const resetTitleVolumesEntry = (titleName: string) => {
        // Resetting the running value on all volumes
        jobsVolumes.current.set(titleName, []);

        setJobsState((prevState) => {
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

    useEffect(() => {
        websocket.current = new WebSocket(`ws://${props.host}:8082`);

        websocket.current.onopen = () => {
            console.log("SocketManager connected");
        }

        websocket.current.onclose = () => {
            console.log("SocketManager disconnected");
        }

        websocket.current.onmessage = (event: MessageEvent) => {
            const eventData = JSON.parse(event.data);
            console.log("[DATA] ", eventData);

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
            if (existingDefinedJobItem) console.log("[INFO] Job defined ", existingDefinedJobItem);

            // Updating job volumes ref
            let existingTitlesVolumesIndex: VolumeItem[] | undefined = jobsVolumes.current.get(titleName);
            console.log("[INDEX] ", existingTitlesVolumesIndex)
            if (existingTitlesVolumesIndex) {
                console.log("[LOG] existing index ", titleName)
                const existingVolume: VolumeItem | undefined = jobsVolumes.current.get(titleName)!
                    .find(element => element.name == currentVolumeName);
                if (!existingVolume) {
                    console.log("[LOG] adding volume to temp index ", titleName, currentVolumeName)
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
                        console.log("[UPDATE] Progress detected on ", currentVolumeName);
                        console.log("[LOG] Updating volume ", titleName, currentVolumeName);
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
                existingDefinedJobItem!.title.volumes = existingTitlesVolumesIndex
                existingDefinedJobItem!.title.running = isJobRunning(titleName);

                // Updating jobVolumes global variable
                jobsVolumes.current.set(titleName, existingTitlesVolumesIndex);

                // Updating global job variable
                setJobsState((prevState) => {
                    return jobsState.map((job) => {
                        if (job.title.name === titleName) {
                            return existingDefinedJobItem!
                        } else {
                            return job
                        }
                    })
                })
            } else {
                console.log("[LOG] index not defined ", existingTitlesVolumesIndex)
            }

            console.log("[RESULT] Global jobs", jobsState);
            console.log("[RESULT] Global volumes", jobsVolumes);

            return () => {
                websocket.current?.close();
            }
        }
    }, []);

    console.log(jobsState)

    return (
        <ul>
            {jobsState.map((job) => (
                <JobCard
                    key={job.id}
                    job={job}
                    host={props.host}
                    setJobRunningToUndefined={setJobRunningToUndefined}
                    resetTitleVolumesEntry={resetTitleVolumesEntry}
                ></JobCard>
            ))}
        </ul>
    )
}