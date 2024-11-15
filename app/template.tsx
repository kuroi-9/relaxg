'use client'

import React, {useEffect} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import "./globals.css";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const navLinks = [
        {href: "/job-manager", label: "Job Manager"},
        {href: "/history", label: "History"},
        {href: "/about", label: "About"},
    ]

    const pathname = usePathname();

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            console.log('Connecté au serveur WebSocket');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
        };

        ws.onclose = () => {
            console.log('Connexion WebSocket fermée');
        };
    }, []);

    return (
        <html lang="en">
        <body>
        <nav className="flex flex-row justify-center border-2 border-white mb-8">
            {navLinks.map(link => (
                <Link href={link.href} key={link.href}
                      className={"m-8 " + (pathname == link.href ? "underline" : "no-underline")}>{link.label}</Link>
            ))}
        </nav>
        {children}
        </body>
        </html>
    );
}
