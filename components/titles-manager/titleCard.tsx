'use client'

import {Key} from "react";
import Image from "next/image";
import "./titles-manager.css";

export default function TitleCard(props: {
    title: {
        id: Key | null | undefined; "title-name": string;
        "publication-status": string; "post-treated": boolean
    },
    dev: boolean
}) {
    return (
        <div className="title-card-container border-2 flex flex-col rounded-2xl" style={{maxWidth: 300, maxHeight: 600, minWidth: 300, minHeight: 600}}>
            <div 
            className="flex flex-col justify-center items-center" 
            style={{
                minHeight: 400, 
                backgroundColor: "var(--foreground)",
                borderStartStartRadius: "13px",
                borderStartEndRadius: "13px"}}>
                <Image
                    src={`https://api${(props.dev) ? '-dev' : ''}.relaxg.app/images/` + props.title["title-name"].replaceAll(" ", "_") + "_cover.jpg"}
                    alt="No cover available"
                    className="w-full mb-0 overflow-hidden rounded-ss-2xl rounded-se-2xl"
                    width={284}
                    height={400}
                    style={{
                        backgroundColor: "var(--background)",
                        borderStartStartRadius: "14.2px",
                        borderStartEndRadius: "14.2px"}}
                />
            </div>
            <div
                className={`title-card-name-container border-t-2 title-card mt-0 h-full w-full bg-${props.title["post-treated"] ? "green" : "black"}-600`}>
                <div className="card h-full flex flex-col justify-between items-center">
                    <h3 className="card-title p-2" style={{textAlign: "center"}}>{props.title["title-name"]}</h3>
                    <div className="flex flex-col justify-between items-center">
                        <h4 className="card-publication-status">{props.title["publication-status"]}</h4>
                        <h4 className={`post-treated text-${props.title["post-treated"] ? 'green' : 'red'}-600`}>
                            {props.title["post-treated"] ? "UPSCALED TITLE AVAILABLE" : "ONLY ORIGINAL"}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    )
}