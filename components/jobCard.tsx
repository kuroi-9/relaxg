'use client'

import {Key, ReactElement, useCallback, useEffect, useRef, useState} from "react";
import VolumeCard from "@/components/volumeCard";
import Emoji from "react-emoji-render";

interface VolumeItem {
    key: string;
    treatedPagesCount: number;
    totalPagesCount: number;
    percentage: number | undefined;
    running: boolean;
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
    //TODO: useState ONLY to re-render (currentJob) and useRef for the others, to store useEffect fetched data
    const globalPercentage = useRef<number>(0);
    const currentTitleVolumes = useRef<VolumeItem[]>([]);
    const webSocket = useRef<WebSocket>();

    const [currentJob, setCurrentJob] = useState<JobItem | undefined>(undefined);
    const stopOrResumeElement = useRef<ReactElement | undefined>(undefined);
    const loadingText = useRef<string | undefined>(undefined);

    // NOT rerendering
    const isRunning = () => {
        for (const volume of currentTitleVolumes.current) {
            if (volume.running) return true;
        }

        return false;
    }

    // NOT RERENDERING
    const handleResume = useCallback(() => {
        fetch(`http://${props.host}:8082/jobs/resume/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"title-id": `${props.job["title-id"]}`, "job-id": `${props.job.id}`})
        }).then(() => {
                console.log("Resuming job " + props.job.id + "...")
            }
        );

        loadingText.current = 'Starting...';
        stopOrResumeElement.current = undefined;
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
    }, [props.host, props.job]);

    const handleStop = useCallback(() => {
        fetch(`http://${props.host}:8082/jobs/stop/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"title-id": `${props.job["title-id"]}`, "job-id": `${props.job.id}`})
        }).then(() => {
                console.log("Stopping job " + props.job.id + "...")
            }
        );

        loadingText.current = 'Stopping...';
        stopOrResumeElement.current = undefined;
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
    }, [props.host, props.job]);
    
    // const handleDelete = () => {
    
    // }

    // NOT rerendering, TESTED OK
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

            if (data[0] === props.job['title-name']) {
                const currentVolume = currentTitleVolumes.current.find(element => element.key == data[1]);
                if (!currentVolume) {
                    currentTitleVolumes.current.push({
                            key: data[1],
                            treatedPagesCount: (data[2] - 2),
                            totalPagesCount: data[3],
                            percentage: (data[2] - 2) * 100 / data[3],
                            running: Boolean(data[4] === "true")
                        }
                    );

                    if (currentJob == undefined) return;
                } else {
                    if ((((data[2] - 2) * 100 / data[3]) <= 100 && ((data[2] - 2) * 100 / data[3]) >= 0)
                        && currentVolume.percentage !== (data[2] - 2) * 100 / data[3]) {
                        console.log("[UPDATE] Progress detected on " + data[1]);
                        globalPercentage.current = (data[2] - 2) * 100 / data[3];
                    }

                    currentTitleVolumes.current = currentTitleVolumes.current.map((item) => {
                        if (item.key === data[1]) {
                            return {
                                ...item,
                                percentage: (data[2] - 2) * 100 / data[3],
                                running: Boolean(data[4] === "true")
                            }
                        } else {
                            return item
                        }
                    });
                }

                if (currentJob !== undefined) {
                    if (currentTitleVolumes.current.length > 0) {
                        if (isRunning()) {
                            stopOrResumeElement.current =
                                <button className="flex justify-center card-job-id border-2 p-2 shrink-0"
                                        style={{width: '10%', minWidth: '110px'}}
                                        onClick={() => handleStop()}>
                                    <Emoji className="flex" text=":stop_sign:"/><p className="ml-2">Stop</p></button>;
                        } else {
                            stopOrResumeElement.current =
                                <button className="flex justify-center card-job-id border-2 p-2 shrink-0"
                                        style={{width: '10%', minWidth: '110px'}}
                                        onClick={() => handleResume()}>
                                    <Emoji className="flex" text=":play_button:"/><p className="ml-2">Resume</p>
                                </button>;
                        }
                    }

                    setCurrentJob((prevState) => {
                        return {
                            ...prevState,
                            title: {
                                ...prevState!.title,
                                key: props.job["title-name"],
                                volumes: currentTitleVolumes.current,
                                running: isRunning()
                            }
                        }
                    });
                }
            }
        };
    }, [currentJob, currentTitleVolumes, handleResume, handleStop, props.job, stopOrResumeElement]);

    // RERENDERING
    if (currentJob == undefined) {
        setCurrentJob(() => {
            return {
                title: {
                    key: props.job["title-name"],
                    volumes: currentTitleVolumes.current,
                    running: isRunning()
                }
            }
        });
    }

    return (
        <div className="job-card border-2 border-gray-700 m-2 p-2">
            <div className="card flex flex-col flex-wrap justify-between">
                <div className="flex flex-row flex-wrap items-center w-full">
                    <h1 className="card-job-id border-2 p-2" style={{width: "4rem"}}>{props.job.id}</h1>
                    <h1 className="card-job-title-name p-2 ml-2">{props.job["title-name"]}</h1>
                </div>
                <div className="job-infos flex flex-row flex-wrap">
                    <div className="flex flex-row mt-2 flex-wrap">
                        {stopOrResumeElement.current ??
                            <button disabled
                                    className="flex justify-center card-job-id border-2 p-2 shrink-0 border-gray-700 card-job-id"
                                    style={{width: '10%', minWidth: '110px'}}>
                                <p className="ml-1">{loadingText.current}</p></button>}
                    </div>
                    <button disabled={!stopOrResumeElement}
                            className="card-job-id border-2 mt-2 p-2 ml-2  text-red-500"
                            style={{borderColor: !stopOrResumeElement ? "darkred" : "red"}}>Delete
                    </button>
                </div>
                <div className="border-2 mt-2 flex flex-row w-full"
                     style={{borderColor: (currentJob?.title.running === true ? "#fcd34d" : "#374151"), height: "3rem"}}>
                    <div className="m-2" style={{
                        width: globalPercentage.current + "%",
                        backgroundColor: (currentJob?.title.running === true ? "green" : "slategray")
                    }}></div>
                </div>
            </div>
            <div className="card mt-2 border-2 flex flex-row" style={{borderColor: (currentJob?.title.running === true ? "white" : "#374151")}}>
                <ul className="w-full">
                    {
                        currentTitleVolumes.current.filter((element) => element.key !== "launcher.lock" && element.key !== "last_pid").map(volume => (
                            <VolumeCard key={volume.key} volume={volume} running={currentJob?.title.running}/>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}