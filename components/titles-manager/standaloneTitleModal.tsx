'use client'

import "@/app/globals.css"
import "@/app/(protected)/app/titles-manager/titlesManager.css";
import styles from "@/app/(protected)/app/titles-manager/titleActionsModal.module.css";
import {useRouter} from "next/navigation";

export default function StandaloneTitleModal(props: {id: string}) {
    const router = useRouter();

    const handleExit = () => {
        router.push('/app/titles-manager');
    }

    return (
        <div className="title-card">
            <div className={styles.darkBG} />
            <div className={styles.centered + " mt-12"}>
                <div className={styles.content + " grid-rows-[1fr_1fr_1fr]"}>
                    <div className="titleActionsModal__header">
                        <p className="text-center border-b-2 text-wrap break-words w-full">{props.id}</p>
                    </div>
                    <div className="titleActionsModal__body  flex flex-row justify-center items-center">
                        <p className="text-center">Please choose an action below.</p>
                    </div>
                    <div className="titleActionsModal__footer flex flex-row justify-between items-end shrink-0 flex-wrap">
                        <button
                            id={"post-button-" + props.id}
                            className={"secondary-btn"}
                            style={{ minWidth: "33%", lineHeight: "50%", minHeight: "50px", maxHeight: "50px" }}>Create Job</button>
                        <button className={"secondary-btn"}
                            style={{ minWidth: "33%", minHeight: "50px", maxHeight: "50px", borderColor: "gray", color: "gray" }}>Delete previous upscaling</button>
                        <button className={"secondary-btn"} onClick={() => handleExit()}
                            style={{ minWidth: "33%", minHeight: "50px", maxHeight: "50px" }}>Return to the titles manager</button>
                    </div>
                </div>
            </div>
        </div>
    )
}