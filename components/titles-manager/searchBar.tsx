'use client'

import "@/app/globals.css"
import "@/app/(protected)/app/titles-manager/titlesManager.css";

export default function SearchBar(
    props: { filterTitles: (inputText: string) => void }
) {

    return (
        <section className="search-bar-container flex justify-center w-full fixed z-50">
            <input
                id="title-manager-search-bar-input"
                className="search-bar-input primary-input m-2 w-10/12"
                placeholder="Find your next reading..."
                onChange={(event) => props.filterTitles(event.target.value)}></input>
        </section>
    )
}