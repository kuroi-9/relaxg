export const fetchCache = "only-no-store";

import "@/app/globals.css";
import { Suspense } from "react";
import JobsPageContent from "./pageContent";

export default function JobsPage() {
    return (
        <Suspense fallback={<div className="w-full h-2 loader-bar-fast" />}>
            <JobsPageContent />
        </Suspense>
    );
}
