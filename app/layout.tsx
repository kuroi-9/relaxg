'use client'

import React, {useEffect} from "react";
import NavBar from "@/components/navBar";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            console.log('Connected to the WebSocket server');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }, []);

    return (
        <html lang="en">
        <body>
        <NavBar/>
        {children}
        </body>
        </html>
    );
}