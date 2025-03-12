import { Key } from "react";
import "@/app/globals.css"
import "@/app/(protected)/app/titles-manager/titlesManager.css";
import TitlesWrapper from "@/components/titles-manager/titlesWrapper";

export interface TitleItem {
    id: Key | null | undefined;
    "title-name": string;
    "publication-status": string;
    "post-treated": boolean
}

export default async function Page() {
    // Fetching using ISR, so the static page will be regenerated each 60 seconds here
    const titleData = await fetch(
        `https://api${(process.env.MODE === 'developpment')
            ? '-dev'
            : ''}.relaxg.app/titles/`,
        { next: { revalidate: 60 } }).then((res) =>
            res.json()
        )
    const titles: TitleItem[] = [];
    for (const title of titleData) {
        titles.push(title);
    }
    titles.sort(function (a, b) {
        return a['title-name'].localeCompare(b['title-name']);
    });

    return (
        <section>
            <TitlesWrapper titles={titles}></TitlesWrapper>
        </section>
    );
}