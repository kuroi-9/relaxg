'use client'

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import '../app/globals.css'

export default function NavBar() {
    const navLinks = [
        { href: "/jobs-manager", label: "Jobs Manager" },
        { href: "/titles-manager", label: "Titles Manager" },
        { href: "/history", label: "History" },
        { href: "/about", label: "About" },
    ]

    const pathname = usePathname();

    return (
        <nav className="nav-links-container z-10 flex flex-row border-2 border-white mb-8 overflow-x-scroll fixed w-full">
            {navLinks.map(link => (
                <Link href={link.href} key={link.href}
                    className={"nav-link m-8 shrink-0 " + (pathname == link.href ? "underline" : "no-underline")}>{link.label}</Link>
            ))}
        </nav>
    )
}