"use client";

import "@/app/globals.css";
import titleCardStyles from "@/app/styles/titles-manager/titlesManagerTitleCard.module.css";
import { Key } from "react";
import SecureImage from "./secureImage";

/**
 * Component that renders a title card with a title name,
 * an image, a publication status, and a post-treated status.
 *
 * @param props - The component props
 * @param props.title - The title object
 * @param props.title.id - The ID string for the title
 * @param props.title["title-name"] - The title name
 * @param props.title["publication-status"] - The publication status
 * @param props.title["post-treated"] - Whether the title is post-treated
 * @param props.dev - Whether the component is in development mode
 * @returns
 */
export default function TitleCard(props: {
    title: {
        id: Key | null | undefined;
        "title-name": string;
        "publication-status": string;
        "post-treated": boolean;
    };
    dev: boolean;
}) {
    return (
        <div
            className={`${titleCardStyles["title-card-container"]} ${titleCardStyles["titles-list-content"]} titles-list-content`}
        >
            <div
                className={`${titleCardStyles["title-card-image-container"]} animate`}
            >
                <SecureImage
                    titleId={props.title.id}
                    titleName={props.title["title-name"]}
                    dev={props.dev}
                />
            </div>
            <div
                className={`${titleCardStyles["title-card-name-container"]} title-card bg-${
                    props.title["post-treated"] ? "green" : "black"
                }-600`}
            >
                <div className={titleCardStyles["title-card-name"]}>
                    <h3>{props.title["title-name"]}</h3>
                    <div className={titleCardStyles["title-card-content"]}>
                        <h4 className="card-publication-status">
                            {props.title["publication-status"]}
                        </h4>
                        <h4
                            className={`post-treated text-${
                                props.title["post-treated"] ? "green" : "red"
                            }-600`}
                        >
                            {props.title["post-treated"]
                                ? "UPSCALED TITLE AVAILABLE"
                                : "ONLY ORIGINAL"}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
