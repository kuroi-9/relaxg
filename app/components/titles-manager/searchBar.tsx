"use client";

import "@/app/globals.css";
import styles from "@/app/styles/titles-manager/titlesManagerSearchBar.module.css";

export default function SearchBar(props: {
    filterTitlesAction: (inputText: string) => void;
}) {
    return (
        <section className={styles["search-bar-container"]}>
            <input
                id="title-manager-search-bar-input"
                className={`${styles["search-bar-input"]} primary-input`}
                placeholder="Find your next reading..."
                onChange={(event) =>
                    props.filterTitlesAction(event.target.value)
                }
            ></input>
        </section>
    );
}
