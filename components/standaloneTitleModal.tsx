'use client'

import styles from "@/app/titles-manager/titleActionsModal.module.css";
import {useRouter} from "next/navigation";

export default function StandaloneTitleModal(props: {id: string}) {
    const router = useRouter();

    const handleExit = () => {
        router.push('/titles-manager');
    }

    return (
        <div className="title-card">
            <div className={styles.darkBG}/>
            <div className={styles.centered}>
                <div className={styles.content}>
                    <div className="titleActionsModal__header border-b-2">
                        {props.id}
                    </div>
                    <div className="titleActionsModal__body">
                        Please choose an action below.
                    </div>
                    <div className="titleActionsModal__footer flex flex-row w-4/6 justify-between">
                        <button className={styles.actionButton}>Create Job</button>
                        <button className={styles.actionButton}>Delete previous upscaling</button>
                        <button className={styles.actionButton} onClick={handleExit}>Return to the titles manager</button>
                    </div>
                </div>
            </div>
        </div>
    )
}