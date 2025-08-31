import "@/app/globals.css";
import styles from "@/app/styles/jobs-manager/jobsManager.module.css";
import jobCardStyles from "@/app/styles/jobs-manager/jobsManagerJobCard.module.css";

function JobCardSkeleton() {
    return (
        <div
            className={`${jobCardStyles["job-card"]} job-card-skeleton border-gray-700`}
        >
            <div className={jobCardStyles["job-card-content"]}>
                <div className={jobCardStyles["job-card-header"]}>
                    <div
                        className={`${styles["card-job-id-label"]} flex p-2 items-center justify-center animate-pulse bg-gray-700`}
                        style={{
                            width: "4rem",
                            minHeight: "50px",
                            border: "1px solid gray",
                        }}
                    ></div>
                    <div className={jobCardStyles["job-card-title"]}>
                        <div className="animate-pulse bg-gray-700 w-full h-6"></div>
                    </div>
                </div>
                <div className={jobCardStyles["job-card-infos"]}>
                    <div
                        className={`${jobCardStyles["job-card-controls"]} w-full md:w-36`}
                    >
                        <div
                            className={`${styles["stop-or-resume-btn"]} stop-or-resume-btn w-full secondary-btn undefined-btn flex justify-center items-center border-2 p-2 shrink-0 border-gray-700 animate-pulse bg-gray-700`}
                            style={{
                                minHeight: "50px",
                                maxHeight: "45px",
                                color: "white",
                                borderColor: "var(--foreground)",
                                backgroundColor: "#171717",
                                outline: "none",
                            }}
                        ></div>
                    </div>
                    <div
                        className={`w-full md:w-auto md:ml-2 primary-btn animate-pulse bg-gray-700`}
                        style={{
                            margin: "0.5rem",
                            height: "50px",
                            minWidth: "100px",
                            maxHeight: "50px",
                            color: "darkred",
                            outline: "none",
                        }}
                    ></div>
                </div>
                <div
                    className={`${jobCardStyles["job-card-progress-bar"]} animate-pulse bg-gray-700`}
                    style={{
                        marginTop: 0,
                        borderColor: "#374151",
                        height: "3rem",
                        display: "block",
                        minHeight: "50px",
                    }}
                >
                    <div
                        className={
                            jobCardStyles["job-card-progress-bar-content"]
                        }
                        style={{
                            backgroundColor: "slategray",
                        }}
                    >
                        <div className="animate-pulse bg-gray-700 w-full h-6"></div>
                    </div>
                </div>
            </div>
            <div
                className={`${styles["job-volumes-card-container"]} ${jobCardStyles["job-card-volumes-container"]}`}
            >
                <div
                    className={`${styles["job-volumes-card"]} ${jobCardStyles["job-card-volumes-list"]} animate-pulse bg-gray-700`}
                    style={{
                        border: "1px solid gray",
                    }}
                ></div>
            </div>
        </div>
    );
}

export default JobCardSkeleton;
