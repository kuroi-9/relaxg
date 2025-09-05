"use client";

export const dynamic = "force-static";

import { redirect } from "next/navigation";
import { useUser } from "@stackframe/stack";

export default function Home() {
    const user = useUser();
    if (user) {
        user.signOut();
    }

    //console.log("[Root] Redirecting...");
    redirect("/sign-in");
}
