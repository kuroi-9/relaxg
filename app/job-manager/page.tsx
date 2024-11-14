'use client'

import {useEffect} from "react";

export default function JobManagerPage() {
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
        <div className="flex flex-row w-full justify-center">
            <h1>Job manager</h1>
        </div>
    )
}