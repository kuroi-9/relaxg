'use client'

import Emoji from "react-emoji-render";

export default function VolumeCard(props: {
    volume: {
        key: string; treatedPagesCount: number;
        totalPagesCount: number; percentage: number | undefined; completed: boolean
    }, running: boolean | undefined
}) {
    return (
        <section className="flex flex-col w-full">
            <div className="flex flex-row justify-between w-full">
                <h6 className="text-white p-2 break-words">{props.volume.key}</h6>
                <div className="flex flex-row p w-1/4 shrink-0" style={{paddingLeft: "3px"}}>
                    <div className="m-2 flex flex-row justify-center items-center" style={{
                        width: props.volume.percentage + "%",
                        backgroundColor: (props?.running === true ? "green" : "slategray")
                    }}>
                        {props.volume.completed 
                        ? <Emoji text=":check_mark_button:"></Emoji> 
                        : ""}
                    </div>
                </div>
            </div>
            <hr style={{borderColor: (props?.running === true ? "white" : "#374151")}}/>
        </section>
    )
}