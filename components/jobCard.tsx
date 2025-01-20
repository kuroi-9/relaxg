'use client'

import {Key, useEffect, useState} from "react";

interface VolumeItem {
    key: string;
    treatedPagesCount: number;
    totalPagesCount: number;
    percentage: number | undefined;
}

interface TitleItem {
    key: string;
    volumes: VolumeItem[];
}

interface MainItem {
    titles: TitleItem[];
}

export default function JobCard(props: { job: { id: Key | null | undefined; "title-name": string; }; }) {
    const [percentage, setPercentage] = useState(0);



    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8082");
        const jobsList: MainItem = {
            titles: [],
        };

        ws.onopen = () => {
            console.log('Card ' + props.job['title-name'] + ' connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data[0] === props.job['title-name']) {
                console.log('[INFO]: ' + props.job['title-name'], event.data);
                setPercentage(data[2] * 33.3 / data[3]);

                if (!jobsList.titles.find((element) => element.key = props.job['title-name'])) jobsList.titles.push({
                    key: props.job['title-name'],
                    volumes: []
                });

                const currentJobTitle: TitleItem | undefined = jobsList.titles.find((element) => element.key = props.job['title-name']);
                if (!currentJobTitle?.volumes.find((element) => element.key = data[1])) {
                    currentJobTitle?.volumes.push({
                        key: data[1],
                        treatedPagesCount: data[2],
                        totalPagesCount: data[3],
                        percentage: percentage
                    });
                }

                console.log(jobsList);
            }
        };

        ws.onclose = () => {
            console.log('Card ' + props.job['title-name'] + ' disconnected');
        };

        return () => ws.close();
    }, [percentage, props.job]);

    return (
        <div className="job-card border-2 m-2 p-2">
            <div className="card flex flex-row flex-wrap justify-start">
                <div className="job-infos flex flex-row flex-wrap w-2/3">
                    <h1 className="card-job-id border-2 p-2" style={{width: "4rem"}}>{props.job.id}</h1>
                    <h1 className="card-job-title-name p-2">{props.job["title-name"]}</h1>
                </div>
                <div className="bg-green-600" style={{width: percentage + "%"}}></div>
            </div>
        </div>
    )
}