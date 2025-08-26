"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import "@/app/globals.css";
import styles from "./navBar.module.css";
import { useRouter } from "next/navigation";

export default function NavBar(props: {
    redirectUrlLeave: string | undefined;
}) {
    const router = useRouter();
    const navLinks = [
        { href: "/app/jobs-manager", label: "Jobs Manager" },
        { href: "/app/titles-manager", label: "Titles Manager" },
    ];
    const pathname = usePathname();
    const [selected, setSelected] = React.useState<string | undefined>(
        undefined,
    );

    // Redirect if the leave btn has been clicked
    if (selected === (props.redirectUrlLeave ?? "/")) {
        router.push(props.redirectUrlLeave ?? "/");
    }
    // Prevent showing loader when a modal that changes url is open
    if (selected !== undefined && pathname.includes(selected)) {
        setSelected(undefined);
    }

    return (
        <nav className={styles["nav-links-container"]}>
            <div className={styles["nav-links-div"]}>
                {navLinks.map((link) => (
                    <Link
                        href={link.href}
                        key={link.label}
                        className={`${styles["nav-link"]} primary-btn
                            ${
                                selected === link.href &&
                                !pathname.includes(link.href)
                                    ? "loader-bar-fast animate-faster"
                                    : ""
                            }`}
                        style={{
                            color:
                                pathname == link.href
                                    ? "white"
                                    : "var(--foreground)",
                            borderColor:
                                pathname == link.href
                                    ? "var(--foreground)"
                                    : "var(--background)",
                            backgroundColor:
                                pathname == link.href
                                    ? "#171717"
                                    : "var(--background)",
                        }}
                        onClick={() => {
                            setSelected(link.href);
                        }}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            <div className={styles["nav-user-section"]}>
                <button
                    className={`secondary-btn overflow-hidden ${
                        selected === (props.redirectUrlLeave ?? "/") &&
                        !pathname.includes(props.redirectUrlLeave ?? "/")
                            ? "loader-bar-fast-red animate-faster"
                            : ""
                    }`}
                    onClick={() => {
                        setSelected(props.redirectUrlLeave ?? "/");
                    }}
                    style={{ minWidth: "5rem" }}
                >
                    {selected === (props.redirectUrlLeave ?? "/")
                        ? "<3"
                        : "Leave"}
                </button>
            </div>
        </nav>
    );
}
