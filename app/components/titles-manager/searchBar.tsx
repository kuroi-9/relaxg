'use client';

import "@/app/globals.css";
import styles from "@/app/(protected)/app/titles-manager/titleSearchBar.module.css";

export default function SearchBar(props: {
    filterTitles: (inputText: string) => void;
}) {
    return (
        <section className={styles.searchBarContainer}>
            <input
                id="title-manager-search-bar-input"
                className={`${styles.searchBarInput} primary-input`}
                placeholder="Find your next reading..."
                onChange={(event) => props.filterTitles(event.target.value)}
            ></input>
        </section>
    );
}
