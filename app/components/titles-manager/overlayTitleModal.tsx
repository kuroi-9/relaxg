"use client";

import "@/app/globals.css";
import "@/app/(protected)/app/titles-manager/titlesManager.module.css";
import styles from "@/app/(protected)/app/titles-manager/titleActionsModal.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";
import SecureImage from "./secureImage";

export default function OverlayTitleModal(props: {
    id: string;
    hostIp: string;
    dev: boolean;
}) {
    const router = useRouter();
    const [title, setTitle] = useState<string>("Loading...");
    const user = useUser({ or: "redirect" });

    useEffect(() => {
        user.getAuthJson().then((res) => {
            fetch(
                `https://api${props.dev ? "-dev" : ""}.relaxg.app/titles/` +
                    props.id,
                {
                    headers: {
                        "x-stack-access-token": res.accessToken ?? "",
                    },
                }
            ).then((res) => {
                console.log(
                    res.json().then((value) => {
                        setTitle(value["title_name"] ?? "Loading...");
                    })
                );
            });
        });
    }, [props.hostIp, props.id]);

    /**
     * Handle the modal close button
     */
    const handleExit = () => {
        document.querySelector("body")?.classList.remove("modal-open");
        router.back();
    };

    /**
     * Handle the create job post
     */
    const handlePost = () => {
        const postBtn = document.getElementById("post-button-" + props.id);
        postBtn!.textContent = "";
        const postLoadingElement = document.createElement("div");
        postLoadingElement.id = "post-loading-" + props.id;
        postLoadingElement.className = "loader";

        // Change the button to a loading state
        postBtn!.style.borderColor = "#364050";
        postBtn!.setAttribute("disabled", "disabled");
        postBtn!.appendChild(postLoadingElement);

        user.getAuthJson().then((res) => {
            fetch(`https://api${props.dev ? "-dev" : ""}.relaxg.app/jobs/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-stack-access-token": res.accessToken ?? "",
                },
                body: JSON.stringify({
                    "title-id": `${props.id}`,
                    "last-pid": 777,
                    status: "Paused",
                }),
            }).then((response) =>
                response.json().then((value) => {
                    if (value["status"] == "ok, running") {
                        setTimeout(() => {
                            document
                                .querySelector("body")
                                ?.classList.remove("modal-open");
                            router.refresh();
                            router.replace("/app/jobs-manager");
                        }, 1000);
                        postBtn!.removeChild(postLoadingElement);
                        postBtn!.textContent = "Started, redirecting...";
                    } else {
                        postBtn!.textContent = "Job duplicate ?";
                        postBtn!.style.borderColor = "white";
                        postBtn!.removeAttribute("disabled");
                    }
                })
            );
        });
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
                        <p>{title}</p>
                    </div>
                    <div className={styles.titleActionsModalBody + " animate"}>
                        <p>Please choose an action below.</p>
                        {title !== "Loading..." ? (
                            <SecureImage
                                titleId={props.id}
                                titleName={title}
                                dev={props.dev}
                            />
                        ) : (
                            <div className="loader"></div>
                        )}
                    </div>
                    <div className={styles.titleActionsModalFooter}>
                        <button
                            id={"post-button-" + props.id}
                            className={"secondary-btn"}
                            onClick={() => handlePost()}
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
                            Exit
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
