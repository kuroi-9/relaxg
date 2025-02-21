'use client'

import '../app/globals.css';
import { Key, ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import VolumeCard from "@/components/volumeCard";
import Emoji from "react-emoji-render";
import { JobItem, VolumeItem } from './socketManager';
import { useRouter } from 'next/navigation';

export default function JobCard(props: {
    job: JobItem;
    host: string;
    setJobRunningToUndefined: (titleName: string) => void;
    resetTitleVolumesEntry: (titleName: string) => void;
}) {
    const router = useRouter();
    const stopOrResumeElement = useRef<ReactNode>();
    const stopOrResumeElementStatus = useRef<string | undefined>();
    const resumeElement = useRef<ReactNode>();
    const stopElement = useRef<ReactNode>();
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    console.log("Jobcard rebuilding...")

    // Init ReactNode variables values
    resumeElement.current = <button
        id={"resume-btn-" + props.job.id}
        className="stoporresume-btn resume-btn flex justify-center items-center border-2 p-2 shrink-0"
        style={{ width: '10%', minWidth: '130px', minHeight: '50px' }}
        onClick={() => handleResume()}>
        <Emoji text=":play_button:" /><p className="ml-2">Resume</p></button>;
    stopElement.current = <button
        id={"stop-btn-" + props.job.id}
        className="stoporresume-btn stop-btn flex justify-center items-center border-2 p-2 shrink-0"
        style={{ width: '10%', minWidth: '130px', minHeight: '50px' }}
        onClick={() => handleStop()}>
        <Emoji text=":stop_sign:" /><p className="ml-2">Stop</p></button>;


    const handleResume = useCallback(() => {
        setIsLoading(true);
        stopOrResumeElement.current === undefined
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
                body: JSON.stringify({ "title-id": `${props.job.title.id}`, "job-id": `${props.job.id}` })
            }).then(() => {
                console.log("Resuming job " + props.job.id + "...")
                const resumeInterval = setInterval(() => {
                    if (props.job.title.running) {
                        setIsLoading(false);
                        clearInterval(resumeInterval);
                        stopOrResumeElement.current = stopElement.current;
                        stopOrResumeElementStatus.current = "stop";
                    }
                }, 3000)
            }
            );
        }

    }, [props.host, props.job]);

    const handleStop = useCallback(() => {
        setIsLoading(true);
        stopOrResumeElement.current === undefined
        fetch(`http://${props.host}:8082/jobs/stop/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "title-id": `${props.job.title.id}`, "job-id": `${props.job.id}` })

        }).then(() => {
            console.log("Stopping job " + props.job.id + "...");
            const stopInterval = setInterval(() => {
                if (!props.job.title.running) {
                    setIsLoading(false);
                    clearInterval(stopInterval);
                    stopOrResumeElement.current = resumeElement.current;
                    stopOrResumeElementStatus.current = "resume";
                }
            }, 3000)
        });

    }, [props.host, props.job]);

    // TODO: Reduce DOM manual alteration
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
            body: JSON.stringify({ "title-id": `${props.job.title.id}`, "job-id": `${props.job.id}` })
        }).then((response) => {
            response.json().then((value) => {
                if (value['status'] == 'deleted') {
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
                }
            })
        });
    }

    // Init the default control buttons values
    if (stopOrResumeElement.current === undefined) {
        if (props.job.title.running) {
            stopOrResumeElement.current = stopElement.current
            stopOrResumeElementStatus.current = "stop";
            setIsLoading(false);
        } else if (props.job.title.running !== undefined) {
            stopOrResumeElement.current = resumeElement.current
            stopOrResumeElementStatus.current = "resume";
            setIsLoading(false);
        }
    } else if (
        ((stopOrResumeElementStatus.current === "stop" && props.job.title.running === false)
        || (stopOrResumeElementStatus.current === "resume" && props.job.title.running === true))
        && !isLoading
    ) { // To fix incoherence when the client has lost connection to websocket and then reconnects
        stopOrResumeElement.current = undefined;
        setIsLoading(true);
    }

    return (
        <div id={"job-card-" + props.job.id} className="job-card border-2 border-gray-700 m-2 p-2">
            <div className="card flex flex-col flex-wrap justify-between">
                <div className="flex flex-row flex-wrap items-center w-full">
                    <h1 id={"card-job-id-" + props.job.id} className="flex border-2 p-2 items-center" style={{ width: "4rem", minHeight: "50px" }}>{props.job.id}</h1>
                    <h1 id={"card-job-title-name-" + props.job.id} className="card-job-title-name p-2 ml-2">{props.job.title.name}</h1>
                </div>
                <div className="job-infos flex flex-row flex-wrap">
                    <div className="flex flex-row mt-2 flex-wrap">
                        {isLoading ? <button disabled
                            className="stoporresume-btn undefined-btn flex justify-center items-center border-2 p-2 shrink-0 border-gray-700"
                            style={{ width: '10%', minWidth: '130px', minHeight: '50px' }}>
                            <div className='loader' />
                        </button> : stopOrResumeElement.current}
                    </div>
                    <button disabled={isLoading || isDeleted || props.job.title.running === true}
                        id={"delete-btn-" + props.job.id}
                        className="flex flex-row justify-center items-center border-2 mt-2 p-2 ml-2 text-red-500"
                        style={{
                            borderColor: isLoading || props.job.title.running === true ? "darkred" : "red",
                            minWidth: "80px"
                        }}
                        onClick={() => handleDelete()}>Delete
                    </button>
                </div>
                <div className="border-2 mt-2 flex flex-row w-full"
                    style={{
                        borderColor: (props.job.title.running === true ? "#fcd34d" : "#374151"), height: "3rem",
                        display: (props.job.title.running === true ? "block" : "none")
                    }}>
                    <div className="h-full flex flex-row items-center loader-bar" style={{
                        backgroundColor: (props.job.title.running === true ? "green" : "slategray")
                    }}>
                        <p className="z-5" style={{ width: "80%", flexShrink: 0, position: "absolute", left: "35px" }}>
                            {props.job.eta ? "Next volume ETA => " + new Date(props.job.eta).getHours() + ":"
                                + (new Date(props.job.eta).getMinutes() < 10 ? "0" : "") + new Date(props.job.eta).getMinutes()
                                //: (globalPercentage.current > 0 ? "Waiting for ETA..." : "Fetching status...")
                                : "Waiting for ETA..."}
                        </p>
                    </div>
                </div>
            </div>
            <div className="card mt-2 border-2 flex flex-row" style={{ borderColor: (props.job.title.running === true ? "white" : "#374151") }}>
                <ul className="w-full">
                    {!isDeleted ?
                        props.job.title.volumes.filter((element) => element.name !== "launcher.lock" && element.name !== "last_pid").map(volume => (
                            <VolumeCard key={volume.name} volume={volume} running={props.job.title.running} />
                        )) : ""
                    }
                </ul>
            </div>
        </div>
    )
}