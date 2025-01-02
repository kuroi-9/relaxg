'use client'

import {Key, useState} from "react";
import Image from "next/image";

export default function TitleCard(props: {
    title: {
        id: Key | null | undefined; "title-name": string;
        "publication-status": string; "post-treated": boolean
    },
}) {
    return (
        <div>
            <Image
                src={"http://backend:8080/images/" + props.title["title-name"].replaceAll(" ", "_") + "_cover.jpg"}
                alt="nothing to show"
                className="border-2 m-2 w-full mb-0 border-b-0"
                width="1080"
                height="1920"/>
            <div
                className={`title-card border-2 m-2 mt-0 w-full bg-${props.title["post-treated"] ? "green" : "black"}-600`}>
                <div className="card flex flex-col items-center">
                    <h3 className="card-title">{props.title["title-name"]}</h3>
                    <h4 className="card-publication-status">{props.title["publication-status"]}</h4>
                    <h4 className={`post-treated text-${props.title["post-treated"] ? 'green' : 'red'}-600`}>
                        {props.title["post-treated"] ? "UPSCALED TITLE AVAILABLE" : "ONLY ORIGINAL"}
                    </h4>
                </div>
            </div>
        </div>
    )
}