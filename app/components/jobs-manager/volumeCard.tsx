"use client";
import { VolumeItem } from "@/app/interfaces/globals";
import "@/app/globals.css";
import styles from "@/app/styles/jobs-manager/jobsManager.module.css";
import volumeCardStyles from "@/app/styles/jobs-manager/jobsManagerVolumeCard.module.css";
import { useEffect, useState } from "react";
import { CheckMarkIcon } from "@/app/icons/global";

/**
 * Component that renders a volume card with progress information.
 *
 * @param props - The properties passed to the component.
 * @param props.volume - The volume item containing name, percentage, and completion status.
 * @param props.running - Indicates whether the volume computation is currently running.
 * @returns A React component displaying the volume card.
 */
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
            document.getElementById(`volume-${props.volume.name}`)
                ?.scrollWidth! -
            document.getElementById(`volume-${props.volume.name}`)
                ?.clientWidth! -
            5;

        // If the total width is not a number, it means the element is not in the DOM (yet)
        if (!Number.isNaN(totalWidth)) {
            const leftBorder = document.getElementById(
                `volume-${props.volume.name}-left-border`,
            );
            if (leftBorder && scroll !== 0) {
                leftBorder.style.borderRight = `dashed 1px ${
                    props.running ? "var(--foreground)" : "gray"
                }`;
            } else if (leftBorder) {
                leftBorder.style.borderRight = "hidden";
            }
            const rightBorder = document.getElementById(
                `volume-${props.volume.name}-right-border`,
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
        <section className={volumeCardStyles["volume-card-container"]}>
            <div className={volumeCardStyles["volume-card-content"]}>
                <div className={volumeCardStyles["volume-card-left-section"]}>
                    <div
                        id={`volume-${props.volume.name}-left-border`}
                        className={volumeCardStyles["volume-card-border"]}
                        style={{
                            borderRight: "hidden",
                        }}
                    ></div>
                    <div
                        className={
                            volumeCardStyles["volume-card-title-container"]
                        }
                    >
                        <h6
                            id={`volume-${props.volume.name}`}
                            className={`${styles["volume-title-label"]} ${volumeCardStyles["volume-card-title"]}`}
                            onScroll={() =>
                                handleScroll(
                                    document.getElementById(
                                        `volume-${props.volume.name}`,
                                    )?.scrollLeft!,
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
                        className={volumeCardStyles["volume-card-border"]}
                        style={{
                            borderLeft: "hidden",
                        }}
                    ></div>
                </div>
                <div
                    className={volumeCardStyles["volume-card-right-section"]}
                    style={{
                        borderLeft: `1px solid ${
                            props.running ? "var(--foreground)" : "gray"
                        }`,
                    }}
                >
                    <div
                        className={
                            volumeCardStyles["volume-card-percentage-container"]
                        }
                        style={{
                            width: props.volume.completed ? "auto" : "auto",
                            height: "100%",
                            backgroundColor: "transparent",
                        }}
                    >
                        {props.volume.completed ? (
                            <CheckMarkIcon />
                        ) : (
                            <h1
                                className={
                                    styles["volume-computation-percentage"]
                                }
                            >
                                {!props.volume.completed
                                    ? Math.max(
                                          0,
                                          Number(
                                              props.volume.percentage!.toPrecision(
                                                  3,
                                              ),
                                          ),
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
