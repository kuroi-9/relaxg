import TitleCard from "@/components/titles-manager/titleCard";
import {Key} from "react";
import Link from "next/link";

interface TitleItem {
    id: Key | null | undefined; 
    "title-name": string;
    "publication-status": string; 
    "post-treated": boolean
}

export default async function Page() {
    //API is being rewriten, fetching its old state from gcloud run
    console.log(`https://api.relaxg.app/titles/`)
    const titleData = await fetch(`https://api.relaxg.app/titles/`)
    //const titleData = await fetch(process.env.BACKEND_API_URL + "/titles");
    //const data = await fetch('http://192.168.1.29:8080/titles'); //ETH0
    //const data = await fetch('http://192.168.1.31:8080/titles');
    const titlesJson = await titleData.json();
    const titlesArray: TitleItem[] = [];
    for (const title of titlesJson) {
        titlesArray.push(title);
    }
    titlesArray.sort(function(a, b) {
        return a['title-name'].localeCompare(b['title-name']);
    });

    return (
        <ul className="flex flex-row flex-wrap justify-center">
            {titlesArray.map((title: TitleItem) => (
                <Link className="title-card m-4 flex flex-col items-center"
                      key={title.id} href={{
                          pathname: `/app/titles/${title.id}`,
                          query: {name: title["title-name"]}}}>
                    <TitleCard key={title.id} title={title}></TitleCard>
                </Link>
            ))}
        </ul>
    );
}