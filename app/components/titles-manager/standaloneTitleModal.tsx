"use client";

import "@/app/globals.css";
import "@/app/styles/titles-manager/titlesManager.module.css";
import styles from "@/app/styles/titles-manager/titlesManagerActionsModal.module.css";
import { useRouter } from "next/navigation";

export default function StandaloneTitleModal(props: { id: string }) {
    const router = useRouter();

    const handleExit = () => {
        router.push("/app/titles-manager");
    };

    return (
        <section>
            <div className={styles["dark-background"]} />
            <div className={styles.centered}>
                <div className={styles.content}>
                    <div
                        className={
                            styles["title-actions-modal-header"] +
                            " animate-fast"
                        }
                    >
                        <p>{props.id}</p>
                    </div>
                    <div className={styles["title-actions-modal-body"]}>
                        <p>Please choose an action below.</p>
                    </div>
                    <div className={styles["title-actions-modal-footer"]}>
                        <button
                            id={"post-button-" + props.id}
                            className={"secondary-btn"}
                        >
                            Create Job
                        </button>
                        <button
                            className={"secondary-btn"}
                            style={{ borderColor: "gray", color: "gray" }}
                        >
                            Delete previous upscaling
                        </button>
                        <button
                            className={"secondary-btn"}
                            onClick={() => handleExit()}
                        >
                            Return to the titles manager
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
