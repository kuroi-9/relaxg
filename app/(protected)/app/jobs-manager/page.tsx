export const fetchCache = "force-no-store";

import { Suspense } from "react";
import JobsPageContent from "./pageContent";
import "@/app/globals.css";

export default function JobsPage() {
    return (
        <Suspense fallback={<div className="w-full h-2 loader-bar-fast" />}>
            <JobsPageContent />
        </Suspense>
    );
}
