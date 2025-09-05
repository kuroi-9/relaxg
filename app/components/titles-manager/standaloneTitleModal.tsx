"use client";

import "@/app/globals.css";
import "@/app/styles/titles-manager/titlesManager.module.css";
import styles from "@/app/styles/titles-manager/titlesManagerTitleModal.module.css";
import { useRouter } from "next/navigation";

/**
 *
 * @param props - The component props
 * @param props.id - The ID string for the title
 * @returns
 */
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
                        <p>
                            Work in progress, so you can share bookmark a title
                            page :P
                        </p>
                    </div>
                    <div className={styles["title-actions-modal-footer"]}>
                        <button
                            id={"post-button-" + props.id}
                            disabled={true}
                            className={"secondary-btn"}
                            style={{
                                borderColor: "gray",
                                color: "gray",
                                outline: "none",
                            }}
                        >
                            Create Job
                        </button>
                        <button
                            disabled={true}
                            className={"secondary-btn"}
                            style={{
                                borderColor: "gray",
                                color: "gray",
                                outline: "none",
                            }}
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
