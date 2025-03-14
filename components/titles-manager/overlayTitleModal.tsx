'use client'

import styles from "@/app/(protected)/app/titles-manager/titleActionsModal.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/globals.css"
import "@/app/(protected)/app/titles-manager/titlesManager.css";

export default function OverlayTitleModal(props: { id: string; hostIp: string; dev: boolean; }) {
    const router = useRouter();
    const [title, setTitle] = useState<string>("Loading...");

    useEffect(() => {
        fetch(`https://api${(props.dev) ? '-dev' : ''}.relaxg.app/titles/` + props.id)
            .then(res => {
                console.log(res.json()
                    .then(value => {
                        setTitle(value["title_name"])
                    }
                    ))
            })
    }, [props.hostIp, props.id, title]);

    /**
     * Handle the modal close button
     */
    const handleExit = () => {
        document.querySelector('body')?.classList.remove('modal-open');
        router.back();
    }

    /**
     * Handle the create job post
     */
    const handlePost = () => {
        const postBtn = document.getElementById("post-button-" + props.id);
        postBtn!.textContent = "";
        const postLoadingElement = document.createElement('div');
        postLoadingElement.id = "post-loading-" + props.id;
        postLoadingElement.className = 'loader';

        // Change the button to a loading state
        postBtn!.style.borderColor = '#364050';
        postBtn!.setAttribute('disabled', 'disabled');
        postBtn!.appendChild(postLoadingElement);

        fetch(`https://api${(props.dev) ? '-dev' : ''}.relaxg.app/jobs/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "title-id": `${props.id}`, "last-pid": 777, "status": "Paused" })
        }).then(response =>
            response.json().then((value) => {
                if (value['status'] == "ok, running") {
                    setTimeout(() => {
                        document.querySelector('body')?.classList.remove('modal-open');
                        router.refresh();
                        router.replace('/app/jobs-manager');
                    }, 1000);
                    postBtn!.removeChild(postLoadingElement);
                    postBtn!.textContent = "Started, redirecting...";
                } else {
                    postBtn!.textContent = "Job duplicate ?";
                    postBtn!.style.borderColor = 'white';
                    postBtn!.removeAttribute('disabled');
                }
            })
        );
    }

    return (
        <section>
            <div className={styles.darkBG} />
            <div className={styles.centered}>
                <div className={styles.content}>
                    <div className="titleActionsModal__header border-b-2 animate-fast">
                        {title}
                    </div>
                    <div className="titleActionsModal__body animate-fast">
                        Please choose an action below.
                    </div>
                    <div className="titleActionsModal__footer flex flex-row w-10/12 justify-between shrink-0 flex-wrap">
                        <button
                            id={"post-button-" + props.id}
                            className={"secondary-btn"}
                            onClick={() => handlePost()}
                            style={{ minWidth: "33%", lineHeight: "50%", minHeight: "50px", maxHeight: "50px" }}>Create Job</button>
                        <button className={"secondary-btn"}
                            style={{ minWidth: "33%", minHeight: "50px", maxHeight: "50px", borderColor: "gray", color: "gray" }}>Delete previous upscaling</button>
                        <button className={"secondary-btn"} onClick={() => handleExit()}
                            style={{ minWidth: "33%", minHeight: "50px", maxHeight: "50px" }}>Exit</button>
                    </div>
                </div>
            </div>
        </section>)
}