"use client";

import "@/app/globals.css";
import styles from "@/app/(protected)/app/jobs-manager/jobsManager.module.css";
import singleJobStyles from "@/app/(protected)/app/jobs-manager/singleJob.module.css";
import { ReactNode, useCallback, useRef, useState, useEffect } from "react";
import VolumeCard from "@/app/components/jobs-manager/volumeCard";
import { JobItem } from "./socketManager";
import { useUser } from "@stackframe/stack";

function PlayButtonIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hover:text-neutral-800 dark:hover:text-neutral-100"
        >
            <path d="M8 5V19L19 12L8 5Z" fill="#FF9800" />
        </svg>
    );
}

function StopSignIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hover:text-neutral-800 dark:hover:text-neutral-100"
        >
            <rect x="6" y="6" width="12" height="12" fill="#F44336" />
        </svg>
    );
}

function CheckMarkIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hover:text-neutral-800 dark:hover:text-neutral-100"
        >
            <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill="#4CAF50"
            />
        </svg>
    );
}

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
    const completedElement = useRef<ReactNode>();
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const user = useUser({ or: "redirect" });
    const accessToken = undefined;
    console.log("Jobcard rebuilding...", accessToken);

    // Init ReactNode variables values
    resumeElement.current = (
        <button
            id={"resume-btn-" + props.job.id}
            className={`${styles["stop-or-resume-btn"]} secondary-btn w-full resume-btn flex justify-center items-center border-2 p-2 shrink-0`}
            style={{
                minHeight: "50px",
                maxHeight: "45px",
                color: "white",
                borderColor: "var(--foreground)",
                backgroundColor: "#171717",
            }}
            onClick={() => handleResume()}
        >
            <PlayButtonIcon />
            <p className="ml-2" style={{ marginRight: "7%" }}>
                Resume
            </p>
        </button>
    );
    stopElement.current = (
        <button
            id={"stop-btn-" + props.job.id}
            className={`${styles["stop-or-resume-btn"]} secondary-btn w-full stop-btn flex justify-center items-center border-2 p-2 shrink-0`}
            style={{
                minHeight: "50px",
                maxHeight: "45px",
                color: "white",
                borderColor: "var(--foreground)",
                backgroundColor: "#171717",
            }}
            onClick={() => handleStop()}
        >
            <StopSignIcon />
            <p className="ml-2" style={{ marginRight: "7%" }}>
                Stop
            </p>
        </button>
    );
    completedElement.current = (
        <button
            disabled={props.job.completed} // temp, see below TODO
            id={"completed-btn-" + props.job.id}
            className={`${styles["stop-or-resume-btn"]} secondary-btn w-full completed-btn flex justify-center items-center border-2 p-2 shrink-0`}
            style={{
                minHeight: "50px",
                maxHeight: "45px",
                color: "var(--foreground)",
                borderColor: "gray",
                backgroundColor: "var(--background)",
                outline: "none",
            }}
            onClick={() => {
                alert("Checking if new volumes are available");
                // TODO: Delete completed.lock + handleresume()
            }}
        >
            <CheckMarkIcon />
            <p className="ml-2" style={{ marginRight: "7%" }}>
                Completed
            </p>
        </button>
    );

    const handleResume = useCallback(() => {
        if (
            document.getElementsByClassName("stop-or-resume-btn").length > 0 ||
            document.getElementsByClassName("undefined-btn").length > 0 ||
            document.getElementsByClassName("resume-btn").length ==
                document.getElementsByClassName("stop-or-resume-btn").length - 1
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
                    },
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
                },
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
                },
            ).then((response) => {
                response.json().then((value) => {
                    if (value["status"] == "deleted") {
                        const resumeBtn = document.getElementById(
                            "resume-btn-" + props.job.id,
                        );

                        const completeBtn = document.getElementById(
                            "completed-btn-" + props.job.id,
                        );

                        const currentBtn = resumeBtn ? resumeBtn : completeBtn;

                        currentBtn!.textContent = "Deleted";
                        currentBtn!.setAttribute("disabled", "true");
                        currentBtn!.classList.replace(
                            "primary-btn",
                            "secondary-btn",
                        );
                        currentBtn!.style.color = "gray";
                        currentBtn!.style.borderColor = "gray";
                        currentBtn!.style.backgroundColor = "var(--background)";
                        setIsDeleted(true);

                        deleteBtn!.removeChild(deleteLoadingElement);
                        deleteBtn!.textContent = "Delete";

                        document.getElementById(
                            "card-job-id-" + props.job.id,
                        )!.style.color = "#364050";
                        document.getElementById(
                            "card-job-id-" + props.job.id,
                        )!.style.borderColor = "#364050";
                        document.getElementById(
                            "card-job-title-name-" + props.job.id,
                        )!.style.color = "#364050";
                        document
                            .getElementById("job-card-" + props.job.id)
                            ?.classList.remove("border-gray-700");
                        document.getElementById(
                            "job-card-" + props.job.id,
                        )!.style.borderColor = "var(--background)";
                        document.getElementById(
                            "job-volumes-card" + props.job.id,
                        )!.style.border = "none";

                        //props.refresh();
                    }
                });
            });
        });
    };

    const handleComplete = useCallback(() => {
        stopOrResumeElement.current = completedElement.current;
        stopOrResumeElementStatus.current = "completed";
        setIsLoading(false);
    }, [props.job]);

    // Init the default control buttons values
    if (stopOrResumeElement.current === undefined) {
        if (props.job.completed) {
            stopOrResumeElement.current = completedElement.current;
            stopOrResumeElementStatus.current = "completed";
            setIsLoading(false);
        } else {
            if (props.job.title.running) {
                stopOrResumeElement.current = stopElement.current;
                stopOrResumeElementStatus.current = "stop";
                setIsLoading(false);
            } else if (props.job.title.running !== undefined) {
                stopOrResumeElement.current = resumeElement.current;
                stopOrResumeElementStatus.current = "resume";
                setIsLoading(false);
            }
        }
    } else if (stopOrResumeElementStatus.current !== "completed") {
        if (
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
    }

    useEffect(() => {
        if (props.job.completed) {
            setIsLoading(true);
            handleComplete();
        }
    }, [props.job.completed]);

    console.log(props.job);

    return (
        <div
            id={"job-card-" + props.job.id}
            className={`${singleJobStyles["job-card"]} border-gray-700`}
        >
            <h1>{props.job.completed}</h1>
            <div className={singleJobStyles["job-card-content"]}>
                <div className={singleJobStyles["job-card-header"]}>
                    <h1
                        id={"card-job-id-" + props.job.id}
                        className={`${styles["card-job-id-label"]} flex p-2 items-center justify-center`}
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
                        className={singleJobStyles["job-card-title"]}
                    >
                        {props.job.title.name}
                    </h1>
                </div>
                <div className={singleJobStyles["job-card-infos"]}>
                    <div
                        className={`${singleJobStyles["job-card-controls"]} w-full md:w-36`}
                    >
                        {isLoading ? (
                            <button
                                disabled
                                className={`${styles["stop-or-resume-btn"]} stop-or-resume-btn w-full secondary-btn undefined-btn flex justify-center items-center border-2 p-2 shrink-0 border-gray-700`}
                                style={{
                                    minHeight: "50px",
                                    maxHeight: "45px",
                                    color: "white",
                                    borderColor: "var(--foreground)",
                                    backgroundColor: "#171717",
                                    outline: "none",
                                }}
                            >
                                <div className="loader-background" />
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
                        className={`${singleJobStyles["job-card-button-delete"]} w-full md:w-auto md:ml-2 primary-btn`}
                        style={{
                            borderColor:
                                isLoading ||
                                isDeleted ||
                                props.job.title.running === true
                                    ? "darkred"
                                    : "red",
                            backgroundColor: "transparent",
                            minWidth: "100px",
                            maxHeight: "50px",
                            color:
                                isLoading ||
                                isDeleted ||
                                props.job.title.running === true
                                    ? "darkred"
                                    : "red",
                            outline:
                                isLoading ||
                                isDeleted ||
                                props.job.title.running === true
                                    ? "none"
                                    : undefined,
                        }}
                        onClick={() => handleDelete()}
                    >
                        Delete
                    </button>
                </div>
                <div
                    className={`${singleJobStyles["job-card-progress-bar"]} loader-bar`}
                    style={{
                        borderColor:
                            isRunning.current === true ? "#fcd34d" : "#374151",
                        height: "3rem",
                        display:
                            isRunning.current === true &&
                            (props.job.completed === false ||
                                props.job.completed === undefined)
                                ? "block"
                                : "none",
                        minHeight: "50px",
                    }}
                >
                    <div
                        className={
                            singleJobStyles["job-card-progress-bar-content"]
                        }
                        style={{
                            backgroundColor:
                                isRunning.current === true
                                    ? "green"
                                    : "slategray",
                        }}
                    >
                        <p
                            className={
                                singleJobStyles["job-card-progress-text"]
                            }
                        >
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
                className={`${styles["job-volumes-card-container"]} ${singleJobStyles["job-card-volumes-container"]}`}
            >
                <ul
                    id={"job-volumes-card" + props.job.id}
                    className={`${styles["job-volumes-card"]} ${singleJobStyles["job-card-volumes-list"]}`}
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
                                      element.name !== "last_pid",
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
