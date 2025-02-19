'use client'

import '../app/globals.css';
import { Key, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import VolumeCard from "@/components/volumeCard";
import Emoji from "react-emoji-render";
import { useTimer } from 'react-timer-hook';

// We fetch the completed property rather than calculating it because we need to know if the archive have been successfuly created
interface VolumeItem {
    key: string;
    treatedPagesCount: number;
    totalPagesCount: number;
    percentage: number | undefined;
    running: boolean;
    completed: boolean;
}

interface TitleItem {
    key: string;
    volumes: VolumeItem[];
    running: boolean | undefined;
}

interface JobItem {
    title: TitleItem;
}

export default function JobCard(props: {
    job: { id: Key | null | undefined; "title-name": string; "title-id": number };
    host: string;
}) {
    const globalPercentage = useRef<number>(0);
    const currentTitleVolumes = useRef<VolumeItem[]>([]);
    const webSocket = useRef<WebSocket>();
    const [currentJob, setCurrentJob] = useState<JobItem | undefined>(undefined);
    const stopOrResumeElement = useRef<ReactElement | undefined>(undefined);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const {
        seconds,
        restart,
    } = useTimer({ autoStart: false, expiryTimestamp: new Date(), onExpire: () => setJobRunningToUndefined() });
    const eta = useRef<Date | undefined>(undefined);

    const isJobRunning = () => {
        for (const volume of currentTitleVolumes.current) {
            if (volume.running) return true;
        }

        return false;
    }

    const handleResume = useCallback(() => {
        if (document.getElementsByClassName('stop-btn').length > 0
            || document.getElementsByClassName('undefined-btn').length > 0
            || document.getElementsByClassName('resume-btn').length
            == document.getElementsByClassName('stoporresume-btn').length - 1) {
            alert('YOU NEED TO STOP THE RUNNING JOB')
        } else {
            fetch(`http://${props.host}:8082/jobs/resume/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "title-id": `${props.job["title-id"]}`, "job-id": `${props.job.id}` })
            }).then(() => {
                console.log("Resuming job " + props.job.id + "...")
            }
            );

            // Matching maximum server response delay
            const time = new Date();
            time.setSeconds(time.getSeconds() + 12);
            restart(time);
            stopOrResumeElement.current = undefined;
            webSocket.current?.close();
        }

    }, [props.host, props.job, restart]);

    const handleStop = useCallback(() => {
        fetch(`http://${props.host}:8082/jobs/stop/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "title-id": `${props.job["title-id"]}`, "job-id": `${props.job.id}` })
        }).then(() => {
            console.log("Stopping job " + props.job.id + "...")
        }
        );

        // Matching maximum server response delay
        const time = new Date();
        time.setSeconds(time.getSeconds() + 12);
        restart(time);
        stopOrResumeElement.current = undefined;
        webSocket.current?.close();
    }, [props.host, props.job, restart]);

    // Meant to set the stop/resume button to a loading state, awaiting the server response
    const setJobRunningToUndefined = () => {
        setCurrentJob((prevState) => {
            return (
                {
                    ...prevState,
                    title: {
                        ...prevState!.title,
                        running: undefined
                    }
                }
            )
        })

        // Resetting the running value on all volumes
        currentTitleVolumes.current = currentTitleVolumes.current.map((item) => {
            return {
                ...item,
                running: false
            }
        });

        webSocket.current = new WebSocket(`ws://${props.host}:8082`);
    }

    const handleDelete = () => {
        let deleteBtn = document.getElementById("delete-btn-" + props.job.id);
        deleteBtn!.textContent = "";
        let deleteLoadingElement = document.createElement('div');
        deleteLoadingElement.id = "delete-loading-" + props.job.id;
        deleteLoadingElement.className = 'loader-red';
        deleteBtn!.appendChild(deleteLoadingElement);

        fetch(`http://${props.host}:8082/jobs/delete/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "title-id": `${props.job["title-id"]}`, "job-id": `${props.job.id}` })
        }).then((response) => {
            response.json().then((value) => {
                if (value['status'] == 'deleted') {
                    currentTitleVolumes.current = [];
                    let resumeBtn = document.getElementById("resume-btn-" + props.job.id);
                    resumeBtn!.style.borderColor = '#374151';
                    resumeBtn!.textContent = 'Deleted';
                    resumeBtn!.style.color = '#364050';
                    setIsDeleted(true);

                    deleteBtn!.removeChild(deleteLoadingElement);
                    deleteBtn!.textContent = "Delete";
                    deleteBtn?.classList.replace('text-red-500', 'text-gray-700')
                    deleteBtn!.style.borderColor = '#364050';

                    document.getElementById('card-job-id-' + props.job.id)!.style.color = '#364050';
                    document.getElementById('card-job-id-' + props.job.id)!.style.borderColor = '#364050';
                    document.getElementById('card-job-title-name-' + props.job.id)!.style.color = '#364050';
                    document.getElementById("job-card-" + props.job.id)?.classList.remove('border-gray-700');
                    document.getElementById("job-card-" + props.job.id)!.style.borderColor = '#0a0a0a';
                    webSocket.current?.close();
                }
            })
        });
    }

    useEffect(() => {
        console.log(webSocket.current);
        webSocket.current = new WebSocket(`ws://${props.host}:8082`);

        webSocket.current.onopen = () => {
            console.log('Card ' + props.job['title-name'] + ' connected');
        };
        webSocket.current.onclose = () => {
            console.log('Card ' + props.job['title-name'] + ' disconnected');
        };

        const currentWebsocket = webSocket.current;

        return () => currentWebsocket.close();
    }, [props.host, props.job]);

    useEffect(() => {
        if (!webSocket.current) return;

        webSocket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("[DATA]", data);

            // Working only it the global feed message title match the current jobCard 
            if (data[0] === props.job['title-name']) {
                const currentVolume = currentTitleVolumes.current.find(element => element.key == data[1]);
                if (!currentVolume) {
                    currentTitleVolumes.current.push({
                        key: data[1],
                        treatedPagesCount: (data[2] - 3),
                        totalPagesCount: data[3],
                        percentage: (data[2] - 3) * 100 / data[3],
                        running: Boolean(data[4] === "true"),
                        completed: Boolean(data[5] === "true"),
                    }
                    );

                    currentTitleVolumes.current.sort(function (a, b) {
                        return a.key.localeCompare(b.key);
                    });

                    if (currentJob == undefined) return;
                } else {
                    // Set global progress bar
                    // if (data[2] !== 0 && data[2] !== data[3] && data[3] !== "") {
                    //     globalPercentage.current = (data[2] - 3) * 100 / data[3];
                    // }

                    // Handle progress update on a volume
                    if ((((data[2] - 3) * 100 / data[3]) <= 100 && ((data[2] - 3) * 100 / data[3]) >= 0)
                        && currentVolume.percentage !== (data[2] - 3) * 100 / data[3]) {
                        console.log("[UPDATE] Progress detected on " + data[1]);
                        globalPercentage.current = (data[2] - 3) * 100 / data[3];
                        eta.current = new Date(Number(data[6]) * 1000);
                    }

                    currentTitleVolumes.current = currentTitleVolumes.current.map((item) => {
                        if (item.key === data[1]) {
                            return {
                                ...item,
                                percentage: (data[2] - 3) * 100 / data[3],
                                running: Boolean(data[4] === "true"),
                                completed: Boolean(data[5] === "true"),
                            }
                        } else {
                            return item
                        }
                    });

                    currentTitleVolumes.current.sort(function (a, b) {
                        return a.key.localeCompare(b.key);
                    });
                }

                if (currentJob !== undefined) {
                    if (currentTitleVolumes.current.length > 0) {
                        console.log(isJobRunning(), props.job['title-name'])
                        if (isJobRunning()) {
                            stopOrResumeElement.current =
                                <button
                                    id={"stop-btn-" + props.job.id}
                                    className="stoporresume-btn stop-btn flex justify-center border-2 p-2 shrink-0"
                                    style={{ width: '10%', minWidth: '110px' }}
                                    onClick={() => handleStop()}>
                                    <Emoji className="flex" text=":stop_sign:" /><p className="ml-2">Stop</p></button>;
                        } else {
                            stopOrResumeElement.current =
                                <button
                                    id={"resume-btn-" + props.job.id}
                                    className="stoporresume-btn resume-btn flex justify-center border-2 p-2 shrink-0"
                                    style={{ width: '10%', minWidth: '110px' }}
                                    onClick={() => handleResume()}>
                                    <Emoji className="flex" text=":play_button:" /><p className="ml-2">Resume</p>
                                </button>;
                        }
                    }

                    // As it is only called when the correct message is recieved, there is no inite loop
                    // Needed as else, the component will not re-render until a new message comes, 10 seconds later
                    setCurrentJob((prevState) => {
                        return {
                            ...prevState,
                            title: {
                                ...prevState!.title,
                                key: props.job["title-name"],
                                volumes: currentTitleVolumes.current,
                                running: isJobRunning()
                            }
                        }
                    });
                }
            }
        };
    }, [currentJob, currentTitleVolumes, handleResume, handleStop, props.job, seconds, stopOrResumeElement]);

    // Triggered at the first render
    if (currentJob == undefined) {
        setCurrentJob(() => {
            return {
                title: {
                    key: props.job["title-name"],
                    volumes: currentTitleVolumes.current,
                    running: isJobRunning()
                }
            }
        });
    }

    return (
        <div id={"job-card-" + props.job.id} className="job-card border-2 border-gray-700 m-2 p-2">
            <div className="card flex flex-col flex-wrap justify-between">
                <div className="flex flex-row flex-wrap items-center w-full">
                    <h1 id={"card-job-id-" + props.job.id} className="border-2 p-2" style={{ width: "4rem" }}>{props.job.id}</h1>
                    <h1 id={"card-job-title-name-" + props.job.id} className="card-job-title-name p-2 ml-2">{props.job["title-name"]}</h1>
                </div>
                <div className="job-infos flex flex-row flex-wrap">
                    <div className="flex flex-row mt-2 flex-wrap">
                        {stopOrResumeElement.current ?? <button disabled
                            className="stoporresume-btn undefined-btn flex justify-center items-center border-2 p-2 shrink-0 border-gray-700"
                            style={{ width: '10%', minWidth: '110px' }}>
                            <div className='loader' />
                        </button>}
                    </div>
                    <button disabled={stopOrResumeElement.current === undefined || isDeleted || currentJob?.title.running === true}
                        id={"delete-btn-" + props.job.id}
                        className="flex flex-row justify-center items-center border-2 mt-2 p-2 ml-2 text-red-500"
                        style={{
                            borderColor: stopOrResumeElement.current === undefined || currentJob?.title.running === true ? "darkred" : "red",
                            minWidth: "80px"
                        }}
                        onClick={() => handleDelete()}>Delete
                    </button>
                </div>
                <div className="border-2 mt-2 flex flex-row w-full"
                    style={{
                        borderColor: (currentJob?.title.running === true ? "#fcd34d" : "#374151"), height: "3rem",
                        display: (currentJob?.title.running === true ? "block" : "none")
                    }}>
                    <div className="h-full flex flex-row items-center" style={{
                        width: globalPercentage.current + "%",
                        backgroundColor: (currentJob?.title.running === true ? "green" : "slategray")
                    }}>
                        <p className="z-5" style={{ width: "80%", flexShrink: 0, position: "absolute", left: "35px" }}>
                            {eta.current ? "Next volume ETA => " + eta.current.getHours() + ":"
                                + (eta.current.getMinutes() < 10 ? "0" : "") + eta.current.getMinutes()
                                : (globalPercentage.current > 0 ? "Waiting for ETA..." : "Fetching status...")}
                        </p>
                    </div>
                </div>
            </div>
            <div className="card mt-2 border-2 flex flex-row" style={{ borderColor: (currentJob?.title.running === true ? "white" : "#374151") }}>
                <ul className="w-full">
                    {
                        currentTitleVolumes.current.filter((element) => element.key !== "launcher.lock" && element.key !== "last_pid").map(volume => (
                            <VolumeCard key={volume.key} volume={volume} running={currentJob?.title.running} />
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}