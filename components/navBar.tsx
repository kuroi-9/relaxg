'use client'

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import '@/app/globals.css'
import { useUser } from "@stackframe/stack";

export default function NavBar() {
    const [scroll, setScroll] = useState<boolean>();
    const user = useUser();
    const navLinks = [
        { href: "/app/jobs-manager", label: "Jobs Manager" },
        { href: "/app/titles-manager", label: "Titles Manager" },
        { href: "/app/history", label: "History" },
        { href: "/about", label: "About" },
    ]

    const pathname = usePathname();

    return (
        <nav className="nav-links-container z-10 flex flex-row justify-between mb-8 overflow-x-scroll fixed w-full"
            style={{
                boxShadow: "0px 0px 200px 5px var(--background)",
                borderBottom: "1px solid gray",
            }}>
            <div className="nav-links-div flex flex-row items-center overflow-x-scroll">
                {navLinks.map(link => (
                    <Link href={link.href} key={link.href}
                        className={"nav-link p-4 shrink-0 m-4 rounded-md "}
                        style={{
                            color: pathname == link.href ? "var(--background)" : "var(--foreground)",
                            backgroundColor: pathname == link.href ? "var(--foreground)" : "",
                        }}
                    >{link.label}</Link>
                ))}
            </div>
            <div
                className="flex flex-col justify-center pl-4 pr-4"
                style={{
                    borderLeft: "1px solid gray",
                    boxShadow: (window.innerWidth < 660) ? "0px 0px 30px 5px var(--background)" : "",
                }}>
                <button className="primary-btn" onClick={() => user?.signOut()}>Leave</button>
            </div>
        </nav>
    )
}