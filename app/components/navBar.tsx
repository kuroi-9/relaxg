'use client'

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import '@/app/globals.css'
import { useUser } from "@stackframe/stack";
import styles from "./navBar.module.css";

export default function NavBar() {
    const user = useUser({ or: 'redirect' });
    const navLinks = [
        { href: "/app/jobs-manager", label: "Jobs Manager" },
        { href: "/app/titles-manager", label: "Titles Manager" },
        { href: "/app/history", label: "History" },
        { href: "/about", label: "About" },
    ];
    const pathname = usePathname();

    return (
        <nav className={styles.navLinksContainer}>
            <div className={styles.navLinksDiv}>
                {navLinks.map(link => (
                    <Link href={link.href} key={link.href}
                        className={`${styles.navLink} primary-btn`}
                        style={{
                            color: pathname == link.href ? "white" : "var(--foreground)",
                            borderColor: pathname == link.href ? "var(--foreground)" : "var(--background)",
                            backgroundColor: pathname == link.href ? "#171717" : "var(--background)"
                        }}
                    >{link.label}</Link>
                ))}
            </div>
            <div className={styles.navUserSection}>
                <button
                    className="secondary-btn"
                    onClick={() => user?.signOut()}>Leave</button>
            </div>
        </nav>
    )
}