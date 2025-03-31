"use client";

import { Key } from "react";
import "@/app/globals.css";
import styles from "@/app/(protected)/app/titles-manager/titlesManager.module.css";
import SecureImage from "./secureImage";

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
            className={`${styles.titleCardContainer} ${styles.titlesListContent} titles-list-content`}
        >
            <div className={`${styles.titleCardImageContainer} animate`}>
                <SecureImage
                    titleId={props.title.id}
                    titleName={props.title["title-name"]}
                    dev={props.dev}
                />
            </div>
            <div
                className={`${styles.titleCardNameContainer} title-card bg-${
                    props.title["post-treated"] ? "green" : "black"
                }-600`}
            >
                <div className={styles.titleCardName}>
                    <h3>{props.title["title-name"]}</h3>
                    <div className={styles.titleCardContent}>
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
