'use client'

import {Key} from "react";

export default function JobCard(props: { job: { id: Key | null | undefined; } }) {

    return (
        <div className="job-card border-2 m-2">
            <div className="card flex flex-row flex-wrap justify-center">
                <h3 className="card-title">{props.job.id}</h3>
            </div>
        </div>
    )
}