
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
    //TODO: Implement Incremental Static Regeneration (ISR)
    const titleData = await fetch(`https://api${(process.env.MODE === 'developpment') ? '-dev' : ''}.relaxg.app/titles/`).then((res) =>
        res.json()
    )
    const titlesArray: TitleItem[] = [];
    for (const title of titleData) {
        titlesArray.push(title);
    }
    titlesArray.sort(function (a, b) {
        return a['title-name'].localeCompare(b['title-name']);
    });

    return (
        <ul className="flex flex-row flex-wrap justify-center">
            {titlesArray.map((title: TitleItem) => (
                <Link className="title-card m-4 flex flex-col items-center"
                    key={title.id} href={{
                        pathname: `/app/titles/${title.id}`,
                        query: { name: title["title-name"] }
                    }}>
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