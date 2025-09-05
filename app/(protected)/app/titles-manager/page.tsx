export const fetchCache = "only-no-store";

import "@/app/globals.css";
import { Suspense } from "react";
import PageContent from "./pageContent";

export default function Page() {
    return (
        <Suspense fallback={<div className="w-full h-2 loader-bar-fast" />}>
            <PageContent />
        </Suspense>
    );
}
