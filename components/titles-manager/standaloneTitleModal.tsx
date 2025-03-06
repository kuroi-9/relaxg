'use client'

import styles from "@/app/(protected)/app/titles-manager/titleActionsModal.module.css";
import {useRouter} from "next/navigation";

export default function StandaloneTitleModal(props: {id: string}) {
    const router = useRouter();

    const handleExit = () => {
        router.push('/app/titles-manager');
    }

    return (
        <div className="title-card">
            <div className={styles.darkBG}/>
            <div className={styles.centered + "  mt-12"}>
                <div className={styles.content}>
                    <div className="titleActionsModal__header border-b-2">
                        {props.id}
                    </div>
                    <div className="titleActionsModal__body">
                        Please choose an action below.
                    </div>
                    <div className="titleActionsModal__footer flex flex-row w-10/12 justify-between shrink-0 flex-wrap">
                        <button
                            id={"post-button-" + props.id}
                            className={styles.actionButton + " secondary-btn"}
                            style={{ minWidth: "33%", borderColor: "gray", color: "gray" }}
                            disabled>Create Job</button>
                        <button className={styles.actionButton + " secondary-btn"}
                            style={{ minWidth: "33%", borderColor: "gray", color: "gray" }}>Delete previous upscaling</button>
                        <button className={styles.actionButton + " secondary-btn"} onClick={() => handleExit()}
                            style={{ minWidth: "33%" }}>Return to the title manager</button>
                    </div>
                </div>
            </div>
        </div>
    )
}