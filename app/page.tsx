export const dynamic = 'force-static'

import Link from "next/link";

export default function Home() {
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div>
                    <h1 className="text-6xl">Loïc Delon</h1>
                    <h4 className="text-2xl">Développeur</h4>
                    <hr className="m-4" />
                </div>

                <div className="grid grid-rows-[1fr_10px] grid-flow-col gap-2 w-full">
                    <Link className="primary-btn text-center" href="/app/jobs-manager">Essayer RelaxG - v0.5</Link>
                    <div className="grid grid-cols-2 grid-flow-row gap-2">
                        <Link className="secondary-btn text-center" href="https://github.com/kuroi-9">Github</Link>
                        <Link className="secondary-btn text-center" href="https://portfoliodelonl-kuroi-9s-projects.vercel.app/">Portfolio</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
