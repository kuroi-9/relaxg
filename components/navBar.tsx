'use client'

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import '@/app/globals.css'
import { UserButton } from "@stackframe/stack";

export default function NavBar() {
    const navLinks = [
        { href: "/app/jobs-manager", label: "Jobs Manager" },
        { href: "/app/titles-manager", label: "Titles Manager" },
        { href: "/app/history", label: "History" },
        { href: "/about", label: "About" },
    ]

    const pathname = usePathname();

    return (
        <nav className="nav-links-container z-10 flex flex-row justify-between border-b-2 mb-8 overflow-x-scroll fixed w-full">
            <div className="flex flex-row items-center overflow-x-scroll">
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
                className="flex flex-col justify-center p-8"
                style={{
                    borderLeft: "solid var(--foreground) 2px"
                }}>
                <UserButton />
            </div>
        </nav>
    )
}