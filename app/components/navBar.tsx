"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import "@/app/globals.css";
import { useUser } from "@stackframe/stack";
import styles from "./navBar.module.css";

export default function NavBar() {
    const user = useUser({ or: "redirect" });
    const navLinks = [
        { href: "/app/jobs-manager", label: "Jobs Manager" },
        { href: "/app/titles-manager", label: "Titles Manager" },
    ];
    const pathname = usePathname();
    const [selected, setSelected] = React.useState<string | undefined>(
        undefined,
    );

    // Prevent showing loader when a modal that changes url is open
    if (selected !== undefined && pathname.includes(selected)) {
        setSelected(undefined);
    }

    return (
        <nav className={styles.navLinksContainer}>
            <div className={styles.navLinksDiv}>
                {navLinks.map((link) => (
                    <Link
                        href={link.href}
                        key={link.label}
                        className={`${styles.navLink} primary-btn
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
            <div className={styles.navUserSection}>
                <button
                    className="secondary-btn"
                    onClick={() => {
                        user?.signOut();
                        window.location.replace("/");
                    }}
                >
                    Leave
                </button>
            </div>
        </nav>
    );
}
