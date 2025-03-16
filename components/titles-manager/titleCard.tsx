'use client'

import {Key} from "react";
import Image from "next/image";
import "@/app/globals.css"
import "@/app/(protected)/app/titles-manager/titlesManager.css";


export default function TitleCard(props: {
    title: {
        id: Key | null | undefined; "title-name": string;
        "publication-status": string; "post-treated": boolean
    },
    dev: boolean
}) {
    return (
        <div className="title-card-container masonry-content flex flex-col" style={{maxWidth: 300, minWidth: 300, border: "1px solid var(--foreground)"}}>
            <div 
            className="flex flex-col justify-center items-center animate" 
            style={{
                backgroundColor: "var(--foreground)",
                }}>
                <Image
                    src={`https://api${(props.dev) ? '-dev' : ''}.relaxg.app/images/` + props.title["title-name"].replaceAll(" ", "_") + "_cover.jpg"}
                    alt={`cover-${props.title.id}`} 
                    className="h-full mb-0 overflow-hidden"
                    width={300}
                    height={0}
                    style={{
                        backgroundColor: "var(--background)",
                        }}
                />
            </div>
            <div
                className={`title-card-name-container overflow-scroll title-card mt-0 w-full bg-${props.title["post-treated"] ? "green" : "black"}-600`}
                style={{borderTop: "1px solid gray"}}>
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