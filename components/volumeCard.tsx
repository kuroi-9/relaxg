'use client'

import Emoji from "react-emoji-render";
import { VolumeItem } from "./socketManager";

export default function VolumeCard(props: {
    volume: VolumeItem,
    running: boolean | undefined
}) {
    return (
        <section className="flex flex-col w-full">
            <div className="flex flex-row justify-between w-full" style={{ minHeight: "50px" }}>
                <div className="flex items-center">
                    <h6 className="text-white p-2 break-words">{props.volume.name}</h6>
                </div>
                <div className="flex flex-col w-1/4 shrink-0 m-2" style={{ paddingLeft: "3px" }}>
                    <div className="flex flex-row justify-center">
                        <h1 className="absolute">{!props.volume.completed ? Math.max(0, Number(props.volume.percentage!.toPrecision(3))) + "%" : ""}</h1>
                    </div>
                    <div className="flex flex-row justify-center items-center" style={{
                        width: props.volume.completed ? "auto" : Math.max(0, Number(props.volume.percentage!.toPrecision(3))) + "%",
                        height: "100%",
                        backgroundColor: (props?.running === true ? "green" : "slategray")
                    }}>
                        {props.volume.completed
                            ? <Emoji text=":check_mark_button:"></Emoji>
                            : ""}
                    </div>
                </div>
            </div>
        </section>
    )
}