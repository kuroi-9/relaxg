'use client'
import { VolumeItem } from "./socketManager";
import "@/app/globals.css"
import styles from "@/app/(protected)/app/jobs-manager/jobsManager.module.css";
import { useState } from "react";

export default function VolumeCard(props: {
    volume: VolumeItem,
    running: boolean | undefined
}) {
    const [scroll, setScroll] = useState<number>(0);

    const handleScroll = (value: number) => {
        setScroll(value);
    }

    return (
        <section className="flex flex-col w-full animate-fast">
            <div className="flex flex-row justify-between w-full" style={{ minHeight: "50px" }}>
                <div className="flex flex-row w-3/4 justify-between">
                    <div
                        className="min-h-full flex flex-col shrink-0"
                        style={{
                            width: "1%",
                            borderRight: (scroll > 0)
                                ? `dashed 1px ${props.running ? "var(--foreground)" : "gray"}` : "hidden",
                        }}></div>
                    <div
                        className="flex items-center"
                        style={{
                            width: "98%",
                        }}>
                        <h6 id={`bruh-${props.volume.name}`} className={`${styles.volumeTitleLabel} p-2 whitespace-nowrap overflow-y-hidden`} onScroll={() => handleScroll(document.getElementById(`bruh-${props.volume.name}`)?.scrollLeft!)}
                            style={{ color: props.running ? "var(--foreground)" : "gray" }}>{props.volume.name}</h6>
                    </div>
                    <div className="min-h-full flex flex-col shrink-0" style={{ 
                        width: "1%",
                        borderLeft: (scroll < document.getElementById(`bruh-${props.volume.name}`)?.scrollWidth! - document.getElementById(`bruh-${props.volume.name}`)?.clientWidth! - 5)
                                ? `dashed 1px ${props.running ? "var(--foreground)" : "gray"}` : "hidden"
                        }}></div>
                </div>
                <div className="flex flex-col w-1/4 shrink-0" style={{ borderLeft: `1px solid ${props.running ? "var(--foreground)" : "gray"}` }}>

                    <div className="flex m-2 rounded-md flex-row justify-center items-center" style={{
                        width: props.volume.completed ? "auto" : "auto",
                        height: "100%",
                        backgroundColor: props.volume.completed ? ((props.running) ? "green" : "slategray") : "transparent"
                    }}>
                        {props.volume.completed
                            ? ""
                            : <h1 className={styles.volumeComputationPercentage + " rounded-md"}>{!props.volume.completed ? Math.max(0, Number(props.volume.percentage!.toPrecision(3))) + "%" : ""}</h1>}
                    </div>
                </div>
            </div>
        </section>
    )
}