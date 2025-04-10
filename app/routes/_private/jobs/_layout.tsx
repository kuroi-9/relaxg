import { Outlet } from "@remix-run/react";

export default function JobsLayout() {
    return (
        <>
            <header>
                <h1>Jobs Dashboard Layout</h1>
                <hr />
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}
