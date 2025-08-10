export const dynamic = "force-static";

import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
    console.log("Redirecting...");
    redirect("https://www.loicdelon.fr");

    return <></>;
}
