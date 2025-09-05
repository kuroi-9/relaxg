"use client";

export const dynamic = "force-static";

import { useUser } from "@stackframe/stack";
import { redirect } from "next/navigation";

export default function Home() {
    const user = useUser();
    if (user) {
        user.signOut();
    }

    //console.log("[Root] Redirecting...");
    redirect("/sign-in");
}
