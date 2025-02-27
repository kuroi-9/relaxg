'use client'

import styles from "@/app/titles-manager/titleActionsModal.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OverlayTitleModal(props: { id: string; hostIp: string }) {
    const router = useRouter();
    const [title, setTitle] = useState<string>("Loading...");

    console.log(props.hostIp)
    useEffect(() => {
        fetch(`http://${props.hostIp}:8082/titles/` + props.id)
            .then(res => {
                console.log(res.json()
                    .then(value => {
                        setTitle(value["title_name"])
                    }
                    ))
            })
    }, [props.hostIp, props.id, title]);

    const handleExit = () => {
        document.querySelector('body')?.classList.remove('modal-open');
        router.back();
    }

    const handlePost = () => {
        let postBtn = document.getElementById("post-button-" + props.id);
        postBtn!.textContent = "";
        let postLoadingElement = document.createElement('div');
        postLoadingElement.id = "post-loading-" + props.id;
        postLoadingElement.className = 'loader';

        postBtn!.style.borderColor = '#364050';
        postBtn!.setAttribute('disabled', 'disabled');
        postBtn!.appendChild(postLoadingElement);

        fetch(`http://${props.hostIp}:8082/jobs/`, {
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
                        router.replace('/jobs-manager');
                    }, 1000);
                    postBtn!.removeChild(postLoadingElement);
                    postBtn!.textContent = "Started, redirecting...";
                } else {
                    console.log('server side error');
                    postBtn!.textContent = "An error occured, please click to try again :(";
                    postBtn!.style.borderColor = 'white';
                    postBtn!.removeAttribute('disabled');
                }
            })
        );
    }

    return (
        <>
            <div className={styles.darkBG} />
            <div className={styles.centered}>
                <div className={styles.content}>
                    <div className="titleActionsModal__header border-b-2">
                        {title}
                    </div>
                    <div className="titleActionsModal__body">
                        Please choose an action below.
                    </div>
                    <div className="titleActionsModal__footer flex flex-row w-10/12 justify-between shrink-0 flex-wrap">
                        <button
                            id={"post-button-" + props.id}
                            className={styles.actionButton}
                            onClick={() => handlePost()}
                            style={{ minWidth: "33%" }}>Create Job</button>
                        <button className={styles.actionButton}
                            style={{ minWidth: "33%" }}>Delete previous upscaling</button>
                        <button className={styles.actionButton} onClick={() => handleExit()}
                            style={{ minWidth: "33%" }}>Exit</button>
                    </div>
                </div>
            </div>
        </>)
}