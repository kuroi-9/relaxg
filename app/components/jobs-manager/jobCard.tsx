"use client";

import "@/app/globals.css";
import styles from "@/app/(protected)/app/jobs-manager/jobsManager.module.css";
import singleJobStyles from "@/app/(protected)/app/jobs-manager/singleJob.module.css";
import { ReactNode, useCallback, useRef, useState } from "react";
import VolumeCard from "@/app/components/jobs-manager/volumeCard";
import Emoji from "react-emoji-render";
import { JobItem } from "./socketManager";
import { useUser } from "@stackframe/stack";

export default function JobCard(props: {
    job: JobItem;
    host: string;
    setJobRunningToUndefined: (titleName: string) => void;
    resetTitleVolumesEntry: (titleName: string) => void;
    dev: boolean;
    refresh: () => void;
}) {
    const stopOrResumeElement = useRef<ReactNode>();
    const stopOrResumeElementStatus = useRef<string | undefined>();
    const isRunning = useRef<boolean | undefined>();
    const resumeElement = useRef<ReactNode>();
    const stopElement = useRef<ReactNode>();
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const user = useUser({ or: "redirect" });
    const accessToken = undefined;
    console.log("Jobcard rebuilding...", accessToken);

    // Init ReactNode variables values
    resumeElement.current = (
        <button
            id={"resume-btn-" + props.job.id}
            className={`${styles.stopOrResumeBtn} secondary-btn resume-btn flex justify-center items-center border-2 p-2 shrink-0`}
            style={{
                width: "10%",
                minWidth: "130px",
                minHeight: "50px",
                maxHeight: "45px",
                color: "white",
                borderColor: "var(--foreground)",
                backgroundColor: "#171717",
            }}
            onClick={() => handleResume()}
        >
            <Emoji text=":play_button:" />
            <p className="ml-2">Resume</p>
        </button>
    );
    stopElement.current = (
        <button
            id={"stop-btn-" + props.job.id}
            className={`${styles.stopOrResumeBtn} secondary-btn stop-btn flex justify-center items-center border-2 p-2 shrink-0`}
            style={{
                width: "10%",
                minWidth: "130px",
                minHeight: "50px",
                maxHeight: "45px",
                color: "white",
                borderColor: "var(--foreground)",
                backgroundColor: "#171717",
            }}
            onClick={() => handleStop()}
        >
            <Emoji text=":stop_sign:" />
            <p className="ml-2">Stop</p>
        </button>
    );

    const handleResume = useCallback(() => {
        if (
            document.getElementsByClassName("stopOrResumeBtn").length > 0 ||
            document.getElementsByClassName("undefined-btn").length > 0 ||
            document.getElementsByClassName("resume-btn").length ==
                document.getElementsByClassName("stopOrResumeBtn").length - 1
        ) {
            alert("YOU NEED TO STOP THE RUNNING JOB");
        } else {
            setIsLoading(true);
            stopOrResumeElement.current === undefined;

            user.getAuthJson().then((res) => {
                fetch(
                    `https://api${
                        props.dev ? "-dev" : ""
                    }.relaxg.app/jobs/resume/`,
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "x-stack-access-token": res.accessToken ?? "",
                        },
                        body: JSON.stringify({
                            "title-id": `${props.job.title.id}`,
                            "job-id": `${props.job.id}`,
                        }),
                    }
                ).then(() => {
                    console.log("Resuming job " + props.job.id + "...");
                    const resumeInterval = setInterval(() => {
                        console.log(props.job.title.running);
                        if (isRunning.current) {
                            stopOrResumeElement.current = stopElement.current;
                            stopOrResumeElementStatus.current = "stop";
                            setIsLoading(false);
                            clearInterval(resumeInterval);
                        }
                    }, 3000);
                });
            });
        }
    }, [props.job]);

    const handleStop = useCallback(() => {
        setIsLoading(true);
        stopOrResumeElement.current === undefined;
        
        user.getAuthJson().then((res) => {
            fetch(
                `https://api${props.dev ? "-dev" : ""}.relaxg.app/jobs/stop/`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "x-stack-access-token": res.accessToken ?? "",
                    },
                    body: JSON.stringify({
                        "title-id": `${props.job.title.id}`,
                        "job-id": `${props.job.id}`,
                    }),
                }
            ).then(() => {
                console.log("Stopping job " + props.job.id + "...");
                const stopInterval = setInterval(() => {
                    if (!isRunning.current) {
                        setIsLoading(false);
                        clearInterval(stopInterval);
                        stopOrResumeElement.current = resumeElement.current;
                        stopOrResumeElementStatus.current = "resume";
                    }
                }, 3000);
            });
        });
    }, [props.job]);

    // TODO: Reduce DOM manual alteration
    const handleDelete = () => {
        const deleteBtn = document.getElementById("delete-btn-" + props.job.id);
        deleteBtn!.textContent = "";
        const deleteLoadingElement = document.createElement("div");
        deleteLoadingElement.id = "delete-loading-" + props.job.id;
        deleteLoadingElement.className = "loader-red";
        deleteBtn!.appendChild(deleteLoadingElement);
        
        user.getAuthJson().then((res) => {
            fetch(
                `https://api${props.dev ? "-dev" : ""}.relaxg.app/jobs/delete/`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "x-stack-access-token": res.accessToken ?? "",
                    },
                    body: JSON.stringify({
                        "title-id": `${props.job.title.id}`,
                        "job-id": `${props.job.id}`,
                    }),
                }
            ).then((response) => {
                response.json().then((value) => {
                    if (value["status"] == "deleted") {
                        const resumeBtn = document.getElementById(
                            "resume-btn-" + props.job.id
                        );
                        resumeBtn!.textContent = "Deleted";
                        resumeBtn!.setAttribute("disabled", "true");
                        resumeBtn!.classList.replace(
                            "primary-btn",
                            "secondary-btn"
                        );
                        resumeBtn!.style.color = "gray";
                        resumeBtn!.style.borderColor = "gray";
                        resumeBtn!.style.backgroundColor = "var(--background)";
                        setIsDeleted(true);

                        deleteBtn!.removeChild(deleteLoadingElement);
                        deleteBtn!.textContent = "Delete";

                        document.getElementById(
                            "card-job-id-" + props.job.id
                        )!.style.color = "#364050";
                        document.getElementById(
                            "card-job-id-" + props.job.id
                        )!.style.borderColor = "#364050";
                        document.getElementById(
                            "card-job-title-name-" + props.job.id
                        )!.style.color = "#364050";
                        document
                            .getElementById("job-card-" + props.job.id)
                            ?.classList.remove("border-gray-700");
                        document.getElementById(
                            "job-card-" + props.job.id
                        )!.style.borderColor = "var(--background)";
                        document.getElementById(
                            "job-volumes-card" + props.job.id
                        )!.style.border = "none";

                        //props.refresh();
                    }
                });
            });
        });
    };

    // Init the default control buttons values
    if (stopOrResumeElement.current === undefined) {
        if (props.job.title.running) {
            stopOrResumeElement.current = stopElement.current;
            stopOrResumeElementStatus.current = "stop";
            setIsLoading(false);
        } else if (props.job.title.running !== undefined) {
            stopOrResumeElement.current = resumeElement.current;
            stopOrResumeElementStatus.current = "resume";
            setIsLoading(false);
        }
    } else if (
        ((stopOrResumeElementStatus.current === "stop" &&
            props.job.title.running === false) ||
            (stopOrResumeElementStatus.current === "resume" &&
                props.job.title.running === true)) &&
        !isLoading
    ) {
        // To fix incoherence when the client has lost connection to websocket and then reconnects
        stopOrResumeElement.current = undefined;
        setIsLoading(true);
    }

    isRunning.current = props.job.title.running === true;

    return (
        <div
            id={"job-card-" + props.job.id}
            className={`${singleJobStyles.jobCard} border-gray-700`}
        >
            <div className={singleJobStyles.jobCardContent}>
                <div className={singleJobStyles.jobCardHeader}>
                    <h1
                        id={"card-job-id-" + props.job.id}
                        className={`${styles.cardJobIdLabel} flex rounded-md p-2 items-center justify-center`}
                        style={{
                            width: "4rem",
                            minHeight: "50px",
                            border: "1px solid gray",
                        }}
                    >
                        {props.job.id}
                    </h1>{" "}
                    <h1
                        id={"card-job-title-name-" + props.job.id}
                        className={singleJobStyles.jobCardTitle}
                    >
                        {props.job.title.name}
                    </h1>
                </div>
                <div className={singleJobStyles.jobCardInfos}>
                    <div className={singleJobStyles.jobCardControls}>
                        {isLoading ? (
                            <button
                                disabled
                                className={`${styles.stopOrResumeBtn} stopOrResumeBtn secondary-btn undefined-btn flex justify-center items-center border-2 p-2 shrink-0 border-gray-700`}
                                style={{
                                    width: "10%",
                                    minWidth: "130px",
                                    minHeight: "50px",
                                    maxHeight: "45px",
                                    color: "white",
                                    borderColor: "var(--foreground)",
                                    backgroundColor: "#171717",
                                }}
                            >
                                <div className="loader" />
                            </button>
                        ) : (
                            stopOrResumeElement.current
                        )}
                    </div>
                    <button
                        disabled={
                            isLoading ||
                            isDeleted ||
                            props.job.title.running === true
                        }
                        id={"delete-btn-" + props.job.id}
                        className={`${singleJobStyles.jobCardButtonDelete} primary-btn`}
                        style={{
                            borderColor:
                                isLoading ||
                                isDeleted ||
                                props.job.title.running === true
                                    ? "darkred"
                                    : "red",
                            backgroundColor: "transparent",
                            minWidth: "80px",
                            maxHeight: "50px",
                            color:
                                isLoading ||
                                isDeleted ||
                                props.job.title.running === true
                                    ? "darkred"
                                    : "red",
                        }}
                        onClick={() => handleDelete()}
                    >
                        Delete
                    </button>
                </div>
                <div
                    className={`${singleJobStyles.jobCardProgressBar} loader-bar`}
                    style={{
                        borderColor:
                            isRunning.current === true ? "#fcd34d" : "#374151",
                        height: "3rem",
                        display: isRunning.current === true ? "block" : "none",
                        minHeight: "50px",
                    }}
                >
                    <div
                        className={singleJobStyles.jobCardProgressBarContent}
                        style={{
                            backgroundColor:
                                isRunning.current === true
                                    ? "green"
                                    : "slategray",
                        }}
                    >
                        <p className={singleJobStyles.jobCardProgressText}>
                            {props.job.eta
                                ? "Next volume ETA => " +
                                  (new Date(props.job.eta).getHours() < 10
                                      ? "0"
                                      : "") +
                                  new Date(props.job.eta).getHours() +
                                  ":" +
                                  (new Date(props.job.eta).getMinutes() < 10
                                      ? "0"
                                      : "") +
                                  new Date(props.job.eta).getMinutes()
                                : "Waiting for ETA..."}
                        </p>
                    </div>
                </div>
            </div>
            <div
                className={`${styles.jobVolumesCardContainer} ${singleJobStyles.jobCardVolumesContainer}`}
            >
                <ul
                    id={"job-volumes-card" + props.job.id}
                    className={`${styles.jobVolumesCard} ${singleJobStyles.jobCardVolumesList}`}
                    style={{
                        border: `${
                            props.job.title.volumes.length === 0 ? "0px" : "1px"
                        } solid ${
                            isRunning.current ? "var(--foreground)" : "gray"
                        }`,
                    }}
                >
                    {!isDeleted
                        ? props.job.title.volumes
                              .filter(
                                  (element) =>
                                      element.name !== "launcher.lock" &&
                                      element.name !== "last_pid"
                              )
                              .map((volume) => (
                                  <div key={volume.name}>
                                      <VolumeCard
                                          volume={volume}
                                          running={isRunning.current}
                                      />
                                      <hr
                                          style={{
                                              borderColor: isRunning.current
                                                  ? "var(--foreground)"
                                                  : "gray",
                                          }}
                                      />
                                  </div>
                              ))
                        : ""}
                </ul>
            </div>
        </div>
    );
}
