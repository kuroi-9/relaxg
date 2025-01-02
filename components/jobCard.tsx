'use client'

import {Key, useEffect, useState} from "react";

export default function JobCard(props: { job: { id: Key | null | undefined; "title-name": string; }; }) {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            console.log('Card ' + props.job['title-name'] + ' connected');
        };

        ws.onmessage = (event) => {
            console.log(props.job['title-name'], event.data);
            const data = JSON.parse(event.data);
            if (data[0] === props.job["title-name"]) {
                setPercentage(data[2] * 33.3 / data[3]);
                console.log(props.job['title-name'] + " : " + percentage);
            }
        };

        ws.onclose = () => {
            console.log('Card ' + props.job['title-name'] + ' disconnected');
        };
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