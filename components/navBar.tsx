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

    window.addEventListener("scroll", function(){
        if(window.scrollY < 20){
          //user is at the top of the page; no need to show the back to top button
          setScroll(false);
        } else {
          setScroll(true);
        }
    });

    return (
        <nav className="nav-links-container z-10 flex flex-row justify-between border-b-2 mb-8 overflow-x-scroll fixed w-full"
            style={{
                boxShadow: (scroll) ? "0px 0px 40px 5px rgba(128, 128, 128, 1)" : "",
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
                    borderLeft: "solid var(--foreground) 2px",
                    boxShadow: (window.innerWidth < 660) ? "0px 0px 10px 10px rgba(128, 128, 128, 1)" : "",
                }}>
                <button className="primary-btn" onClick={() => user?.signOut()}>Leave</button>
            </div>
        </nav>
    )
}