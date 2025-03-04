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
                    <h4 className="text-1xl">Portfolio</h4>
                </div>

                <Link className="primary-btn" href="/app/jobs-manager">Essayer RelaxG</Link>
            </main>
        </div>
    );
}
