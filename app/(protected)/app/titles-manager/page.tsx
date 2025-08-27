import { Suspense } from "react";
import PageContent from "./pageContent";
import "@/app/globals.css";

export default function Page() {
    return (
        <Suspense fallback={<div className="w-full h-2 loader-bar-fast" />}>
            <PageContent />
        </Suspense>
    );
}
