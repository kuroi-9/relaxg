'use client'

import styles from "@/app/titles-manager/titleActionsModal.module.css";
import {redirect, RedirectType, useRouter} from "next/navigation";
import {useEffect, useState} from "react";

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
        document.getElementById('post-button')!.style.borderColor = '#364050';
        document.getElementById('post-button')!.setAttribute('disabled', 'disabled');
        fetch(`http://${props.hostIp}:8082/jobs/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"title-id": `${props.id}`, "last-pid": 777, "status": "Paused"})
        }).then(response =>
            response.json().then((value)=>{
                if (value['status'] == "ok, running") {
                    document.getElementById('post-button')!.textContent = "Started"
                } else {
                    console.log('server side error');
                    document.getElementById('post-button')!.textContent = "An error occured, please click to try again :(";
                    document.getElementById('post-button')!.style.borderColor = 'white';
                    document.getElementById('post-button')!.removeAttribute('disabled');
                }
            })
        );
    }

    return (
        <>
            <div className={styles.darkBG}/>
            <div className={styles.centered}>
                <div className={styles.content}>
                    <div className="titleActionsModal__header border-b-2">
                        {title}
                    </div>
                    <div className="titleActionsModal__body">
                        Please choose an action below.
                    </div>
                    <div className="titleActionsModal__footer flex flex-row w-1/2 justify-between">
                        <button id="post-button" className={styles.actionButton} onClick={() => handlePost()}>Create Job</button>
                        <button className={styles.actionButton}>Delete previous upscaling</button>
                        <button className={styles.actionButton} onClick={() => handleExit()}>Exit</button>
                    </div>
                </div>
            </div>
        </>)
}