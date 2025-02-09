'use client'

import {Key, useEffect, useState} from "react";
import VolumeCard from "@/components/volumeCard";
import Emoji from "react-emoji-render";

interface VolumeItem {
    key: string;
    treatedPagesCount: number;
    totalPagesCount: number;
    percentage: number | undefined;
}

interface TitleItem {
    key: string;
    volumes: VolumeItem[];
    running: boolean | undefined;
}

interface MainItem {
    titles: TitleItem[];
}

export default function JobCard(props: { job: { id: Key | null | undefined; "title-name": string; }; host: string; }) {
    const [percentage, setPercentage] = useState(0);
    const [currentJobTitle, setCurrentJobTitle] = useState<TitleItem | undefined>(undefined);

    const jobsList: MainItem = {
        titles: [],
    };

    useEffect(() => {
        console.log(props.host);
        const ws = new WebSocket(`ws://${props.host}:8082`);

        ws.onopen = () => {
            console.log('Card ' + props.job['title-name'] + ' connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data[0] === props.job['title-name']) {
                console.log('[INFO]: ' + props.job['title-name'], event.data);
                setPercentage(data[2] * 33.3 / data[3]);

                console.log(data[4])
                if (!jobsList.titles.find((element) => element.key = props.job['title-name'])) jobsList.titles.push({
                    key: props.job['title-name'],
                    volumes: [],
                    running: Boolean((data[4] === "true")),
                });

                const currentJT = jobsList.titles.find((element) => element.key = props.job['title-name']);
                if (currentJT) {

                    const currentVolume = currentJT.volumes.find((element) => element.key = data[1]);
                    if (!currentVolume) {
                        currentJT.volumes.push({
                            key: data[1],
                            treatedPagesCount: data[2],
                            totalPagesCount: data[3],
                            percentage: percentage
                        });
                    }
                }

                setCurrentJobTitle(currentJT);
            }
        };

        ws.onclose = () => {
            console.log('Card ' + props.job['title-name'] + ' disconnected');
        };

        return () => ws.close();
    }, [percentage, props.host, props.job]);

    let stopOrResumeElement = undefined;
    if (currentJobTitle?.running === true) {
        stopOrResumeElement =
            <button className="flex justify-center ml-2 card-job-id border-2 p-2" style={{width: '10%'}}>
                <Emoji className="flex" text=":stop_sign:"/><p className="ml-1">Stop</p></button>
    } else {
        stopOrResumeElement =
            <button className="flex justify-center ml-2 card-job-id border-2 p-2" style={{width: '10%'}}>
                <Emoji className="flex" text=":play_button:"/><p className="ml-1">Resume</p></button>
    }

    const handleResume = () => {

    }

    const handleStop = () => {

    }

    const handleDelete = () => {

    }

    console.log(currentJobTitle?.running)

    return (
        <div className="job-card border-2 border-gray-700 m-2 p-2">
            <div className="card flex flex-row flex-wrap justify-between">
                <div className="job-infos flex flex-row flex-wrap w-2/3">
                    <h1 className="card-job-id border-2 p-2" style={{width: "4rem"}}>{props.job.id}</h1>
                    {stopOrResumeElement}
                    <button className="card-job-id border-2 p-2 ml-2 border-red-700 text-red-500">Delete</button>
                    <h1 className="card-job-title-name p-2">{props.job["title-name"]}</h1>
                </div>
                <div className="border-2 flex flex-row w-1/4"
                     style={{borderColor: (currentJobTitle?.running === true ? "#fcd34d" : "white")}}>
                    <div className="m-2" style={{
                        width: percentage + "%",
                        backgroundColor: (currentJobTitle?.running === true ? "green" : "slategray")
                    }}></div>
                </div>
            </div>
            <div className="card mt-2 border-2 flex flex-row">
                <ul className="w-full">
                    {
                        currentJobTitle?.volumes.map(volume => (
                            <VolumeCard key={volume.key} volume={volume} running={currentJobTitle?.running}/>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}