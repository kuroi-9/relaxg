export const fetchCache = "only-no-store";

import TitlesWrapper from "@/app/components/titles-manager/titlesWrapper";
import "@/app/globals.css";
import { DatabaseSchemeTitleItem } from "@/app/interfaces/globals";
import { stackServerApp } from "@/stack";

/**
 *
 * @returns Returns the content data for the titles page in a asynchronous way.
 */
export default async function PageContent() {
    const user = await stackServerApp.getUser();
    const titleData = await fetch(
        `https://api${
            process.env.NEXT_ENV_MODE === "developpment" ? "-dev" : ""
        }.relaxg.app/titles/?page=1&limit=2`,
        {
            method: "GET",
            cache: "no-store",
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
    const titles: DatabaseSchemeTitleItem[] = [];

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
