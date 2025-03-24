'use client';

import "@/app/globals.css";
import "@/app/(protected)/app/titles-manager/titlesManager.module.css";
import styles from "@/app/(protected)/app/titles-manager/titleActionsModal.module.css";
import { useRouter } from "next/navigation";

export default function StandaloneTitleModal(props: { id: string }) {
    const router = useRouter();

    const handleExit = () => {
        router.push("/app/titles-manager");
    };

    return (
        <section>
            <div className={styles.darkBackground} />
            <div className={styles.centered}>
                <div className={styles.content}>
                    <div
                        className={
                            styles.titleActionsModalHeader + " animate-fast"
                        }
                    >
                        <p>{props.id}</p>
                    </div>
                    <div className={styles.titleActionsModalBody}>
                        <p>Please choose an action below.</p>
                    </div>
                    <div className={styles.titleActionsModalFooter}>
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
