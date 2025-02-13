import TitleCard from "@/components/titleCard";
import {Key} from "react";
import Link from "next/link";

export default async function Page() {
    //API is being rewriten, fetching its old state from gcloud run
    console.log(`http://${process.env.VPS_IP ?? process.env.DOCKER_GATEWAY_HOST!}:8082/titles/`)
    const titleData = await fetch(`http://${process.env.VPS_IP ?? process.env.DOCKER_GATEWAY_HOST!}:8082/titles/`)
    //const titleData = await fetch(process.env.BACKEND_API_URL + "/titles");
    //const data = await fetch('http://192.168.1.29:8080/titles'); //ETH0
    //const data = await fetch('http://192.168.1.31:8080/titles');
    const titles = await titleData.json();

    return (
        <ul className="flex flex-row flex-wrap justify-center">
            {Object.values(titles.map((title: {
                id: Key | null | undefined; "title-name": string;
                "publication-status": string; "post-treated": boolean
            }) => (
                <Link className="title-card m-4 flex flex-col items-center"
                      key={title.id} href={{
                          pathname: `/titles/${title.id}`,
                          query: {name: title["title-name"]}}}>
                    <TitleCard key={title.id} title={title}></TitleCard>
                </Link>
            )))}
        </ul>
    );
}