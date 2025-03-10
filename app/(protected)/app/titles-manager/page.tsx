export const dynamic = 'force-static'

import TitleCard from "@/components/titles-manager/titleCard";
import { Key } from "react";
import Link from "next/link";

interface TitleItem {
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
        <ul className="flex flex-row flex-wrap justify-center">
            {titles.map((title: TitleItem) => (
                <Link
                    className="title-card m-4 flex flex-col items-center"
                    key={title.id} href={{
                        pathname: `/app/titles/${title.id}`,
                        query: { name: title["title-name"] }
                    }} scroll={false}>
                    <TitleCard
                        key={title.id}
                        title={title}
                        dev={(process.env.MODE === 'developpment')}
                    ></TitleCard>
                </Link>
            ))}
        </ul>
    );
}