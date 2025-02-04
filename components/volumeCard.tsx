'use client'

export default function VolumeCard(props: { volume: {
    key: string; treatedPagesCount: number;
    totalPagesCount: number; percentage: number | undefined;
}}) {
    return (
        <section className="flex flex-col w-full">
            <div className="flex flex-row justify-between w-full">
                <h6 className="text-white p-2 break-words">{props.volume.key}</h6>
                <div className="flex flex-row p w-1/4 shrink-0" style={{paddingLeft: "3px"}}>
                    <div className="bg-green-600 m-2" style={{width: props.volume.percentage + "%"}}></div>
                </div>
            </div>
            <hr />
        </section>
    )
}