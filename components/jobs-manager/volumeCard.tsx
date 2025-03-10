'use client'
import { VolumeItem } from "./socketManager";
import "./jobs-manager.css";
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
        <section className="flex flex-col w-full">
            <div className="flex flex-row justify-between w-full" style={{ minHeight: "50px" }}>
                <div
                    className="min-h-full flex flex-col"
                    style={{
                        borderRight: (scroll > 0)
                            ? `dashed 1px ${props.running ? "var(--foreground)" : "gray"}` : "hidden",
                        width: (scroll > 0) ? "1%" : "2%"
                    }}></div>
                <div
                    className="flex items-center"
                    style={{
                        width: "73%",
                        borderRight: (scroll < document.getElementById(`bruh-${props.volume.name}`)?.scrollWidth! - document.getElementById(`bruh-${props.volume.name}`)?.clientWidth! - 5)
                            ? `dashed 1px ${props.running ? "var(--foreground)" : "gray"}` : "hidden"
                    }}>
                    <h6 id={`bruh-${props.volume.name}`} className={`volume-title-label p-2 whitespace-nowrap overflow-y-hidden`} onScroll={() => handleScroll(document.getElementById(`bruh-${props.volume.name}`)?.scrollLeft!)}
                        style={{ color: props.running ? "var(--foreground)" : "gray" }}>{props.volume.name}</h6>
                </div>
                <div className="min-h-full flex flex-col" style={{ width: (scroll > 0) ? "1%" : "2%" }}></div>
                <div className="flex flex-col w-1/4 shrink-0" style={{ borderLeft: `1px solid ${props.running ? "var(--foreground)" : "gray"}` }}>

                    <div className="flex m-2 rounded-md flex-row justify-center items-center" style={{
                        width: props.volume.completed ? "auto" : "auto",
                        height: "100%",
                        backgroundColor: props.volume.completed ? ((props.running) ? "green" : "slategray") : "transparent"
                    }}>
                        {props.volume.completed
                            ? ""
                            : <h1 className="volume-computation-percentage rounded-md">{!props.volume.completed ? Math.max(0, Number(props.volume.percentage!.toPrecision(3))) + "%" : ""}</h1>}
                    </div>
                </div>
            </div>
        </section>
    )
}