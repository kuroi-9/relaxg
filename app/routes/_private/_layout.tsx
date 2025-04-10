import { Outlet } from "@remix-run/react";

export default function PrivateLayout() {
    return (
        <>
            <header>
                <h1>Private Dashboard Layout</h1>
                <hr />
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}
