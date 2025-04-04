"use client";
import { VolumeItem } from "./socketManager";
import "@/app/globals.css";
import styles from "@/app/(protected)/app/jobs-manager/jobsManager.module.css";
import singleJobStyles from "@/app/(protected)/app/jobs-manager/singleJob.module.css";
import { useEffect, useState } from "react";

export default function VolumeCard(props: {
    volume: VolumeItem;
    running: boolean | undefined;
}) {
    const [scroll, setScroll] = useState<number>(0);

    /**
     * Handles the scroll event of the volume card.
     * @param value - The scroll value of the volume card.
     */
    const handleScroll = (value: number) => {
        setScroll(value);
    };

    useEffect(() => {
        const totalWidth =
            document.getElementById(`volume-${props.volume.name}`)?.scrollWidth! -
            document.getElementById(`volume-${props.volume.name}`)?.clientWidth! -
            5;

        // If the total width is not a number, it means the element is not in the DOM (yet)
        if (!Number.isNaN(totalWidth)) {
            const leftBorder = document.getElementById(
                `volume-${props.volume.name}-left-border`
            );
            if (leftBorder && scroll !== 0) {
                leftBorder.style.borderRight = `dashed 1px ${
                    props.running ? "var(--foreground)" : "gray"
                }`;
            } else if (leftBorder) {
                leftBorder.style.borderRight = "hidden";
            }
            const rightBorder = document.getElementById(
                `volume-${props.volume.name}-right-border`
            );
            if (rightBorder && scroll < totalWidth) {
                rightBorder.style.borderLeft = `dashed 1px ${
                    props.running ? "var(--foreground)" : "gray"
                }`;
            } else if (rightBorder) {
                rightBorder.style.borderLeft = "hidden";
            }
        }
    }, [scroll, props.running]);

    return (
        <section className={singleJobStyles.volumeCardContainer}>
            <div className={singleJobStyles.volumeCardContent}>
                <div className={singleJobStyles.volumeCardLeftSection}>
                    <div
                        id={`volume-${props.volume.name}-left-border`}
                        className={singleJobStyles.volumeCardBorder}
                        style={{
                            borderRight: "hidden",
                        }}
                    ></div>
                    <div className={singleJobStyles.volumeCardTitleContainer}>
                        <h6
                            id={`volume-${props.volume.name}`}
                            className={`${styles.volumeTitleLabel} ${singleJobStyles.volumeCardTitle}`}
                            onScroll={() =>
                                handleScroll(
                                    document.getElementById(
                                        `volume-${props.volume.name}`
                                    )?.scrollLeft!
                                )
                            }
                            style={{
                                color: props.running
                                    ? "var(--foreground)"
                                    : "gray",
                            }}
                        >
                            {props.volume.name}
                        </h6>
                    </div>
                    <div
                        id={`volume-${props.volume.name}-right-border`}
                        className={singleJobStyles.volumeCardBorder}
                        style={{
                            borderLeft: "hidden",
                        }}
                    ></div>
                </div>
                <div
                    className={singleJobStyles.volumeCardRightSection}
                    style={{
                        borderLeft: `1px solid ${
                            props.running ? "var(--foreground)" : "gray"
                        }`,
                    }}
                >
                    <div
                        className={singleJobStyles.volumeCardPercentageContainer}
                        style={{
                            width: props.volume.completed ? "auto" : "auto",
                            height: "100%",
                            backgroundColor: props.volume.completed
                                ? props.running
                                    ? "green"
                                    : "slategray"
                                : "transparent",
                        }}
                    >
                        {props.volume.completed ? (
                            ""
                        ) : (
                            <h1
                                className={
                                    styles.volumeComputationPercentage +
                                    " rounded-md"
                                }
                            >
                                {!props.volume.completed
                                    ? Math.max(
                                          0,
                                          Number(
                                              props.volume.percentage!.toPrecision(
                                                  3
                                              )
                                          )
                                      ) + "%"
                                    : ""}
                            </h1>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
