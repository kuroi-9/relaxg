'use client'

import Link from "next/link";
import React from "react";
import {usePathname} from "next/navigation";
import '../app/globals.css'

export default function NavBar() {
    const navLinks = [
        {href: "/job-manager", label: "Job Manager"},
        {href: "/titles-manager", label: "Titles Manager"},
        {href: "/history", label: "History"},
        {href: "/about", label: "About"},
    ]

    const pathname = usePathname();

    return (
        <nav className="flex flex-row justify-center border-2 border-white mb-8">
            {navLinks.map(link => (
                <Link href={link.href} key={link.href}
                      className={"m-8 " + (pathname == link.href ? "underline" : "no-underline")}>{link.label}</Link>
            ))}
        </nav>
    )
}