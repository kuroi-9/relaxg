'use client';

import { Key } from "react";
import Image from "next/image";
import "@/app/globals.css";
import styles from "@/app/(protected)/app/titles-manager/titlesManager.module.css";

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
            className={`${styles.title_card_container} ${styles.titles_list_content} titles-list-content`}
        >
            <div className={`${styles.title_card_image_container} animate`}>
                <Image
                    src={
                        `https://api${
                            props.dev ? "-dev" : ""
                        }.relaxg.app/images/` +
                        props.title["title-name"].replaceAll(" ", "_") +
                        "_cover.jpg"
                    }
                    alt={`cover-${props.title.id}`}
                    className="h-full mb-0 overflow-hidden"
                    width={300}
                    height={0}
                    style={{ backgroundColor: "var(--background)" }}
                />
            </div>
            <div
                className={`${styles.title_card_name_container} title-card bg-${
                    props.title["post-treated"] ? "green" : "black"
                }-600`}
            >
                <div className={styles.title_card_name}>
                    <h3>{props.title["title-name"]}</h3>
                    <div className={styles.title_card_content}>
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
