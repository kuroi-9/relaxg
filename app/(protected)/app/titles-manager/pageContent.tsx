import { Key } from "react";
import "@/app/globals.css";
import TitlesWrapper from "@/app/components/titles-manager/titlesWrapper";
import { stackServerApp } from "@/stack";

export interface TitleItem {
    id: Key | null | undefined;
    "title-name": string;
    "publication-status": string;
    "post-treated": boolean;
}

export default async function PageContent() {
    const user = await stackServerApp.getUser();
    // Fetching using ISR, so the static page will be regenerated each 60 seconds here
    const titleData = await fetch(
        `https://api${
            process.env.NEXT_ENV_MODE === "developpment" ? "-dev" : ""
        }.relaxg.app/titles/?page=1&limit=2`,
        {
            next: { revalidate: 60 },
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-stack-access-token":
                    (await user
                        ?.getAuthJson()
                        .then((res) => res.accessToken)) ?? "",
            },
        },
    ).then((res) => res.json());
    const titles: TitleItem[] = [];

    if (titleData.error) {
        return (
            <section>
                <h1>{titleData.error}</h1>
            </section>
        );
    } else {
        for (const title of titleData) {
            titles.push(title);
        }
        titles.sort(function (a, b) {
            return a["title-name"].localeCompare(b["title-name"]);
        });
    }

    return (
        <section>
            <TitlesWrapper titles={titles}></TitlesWrapper>
        </section>
    );
}
