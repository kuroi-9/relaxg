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
        <NavBar/>
        {children}
        </body>
        </html>
    );
}