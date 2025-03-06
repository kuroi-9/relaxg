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

                <div className="grid grid-rows-2 grid-flow-col gap-2">
                    <Link className="primary-btn center" href="/app/jobs-manager">{"=>"} Essayer RelaxG - Ver.0.5 Rev.1</Link>
                    <div className="grid grid-cols-2 grid-flow-row gap-2">
                        <Link className="secondary-btn" href="https://github.com/kuroi-9">Github</Link>
                        <Link className="secondary-btn" href="https://portfoliodelonl-kuroi-9s-projects.vercel.app/">Portfolio</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
