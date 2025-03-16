export const dynamic = 'force-static'

import Link from "next/link";

export default function Home() {
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col row-start-2 items-center sm:items-start">
                <div>
                    <h1 className="text-6xl">Loïc Delon</h1>
                    <h4 className="text-2xl mb-4">Développeur</h4>
                    <div className="grid grid-cols-2 grid-flow-row gap-2">
                        <Link className="secondary-btn text-center" href="https://github.com/kuroi-9">Github</Link>
                        <Link className="secondary-btn text-center" href="https://portfoliodelonl-kuroi-9s-projects.vercel.app/">Portfolio</Link>
                    </div>
                    <hr className="m-4" />
                </div>

                <div className="grid grid-rows-[1fr_1fr] grid-flow-col gap-4 w-full">
                    <Link className="primary-btn text-center" href="/app/jobs-manager">Essayer Relaxg - v0.5</Link>
                    <p className="italic font-serif text-lg">{'\u275D'}A tool to help with manga upscaling{'\u275E'}</p>
                </div>
            </main>
        </div>
    );
}
