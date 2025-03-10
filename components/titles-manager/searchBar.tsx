'use client'

export default function SearchBar(
    props: { filterTitles: (inputText: string) => void }
) {

    return (
        <section className="flex justify-center w-full">
            <input
                className="primary-input m-2 w-10/12"
                placeholder="Find your next reading..."
                onChange={(event) => props.filterTitles(event.target.value)}></input>
        </section>
    )
}