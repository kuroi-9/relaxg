'use client';
import { useStackApp } from "@stackframe/stack";
import { useState } from "react";
import Emoji from "react-emoji-render";
import "@/app/sign-in/sign-in.css"

export default function CredentialSignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const app = useStackApp();

    const onSubmit = async () => {
        if (!password) {
            setError("Merci d'entrer le mot de passe");
            return;
        }
        // this will redirect to app.urls.afterSignIn if successful, you can customize it in the StackServerApp constructor
        const result = await app.signInWithCredential({ email, password });
        // It is better to handle each error code separately, but we will just show the error code directly for simplicity here
        if (result.status === 'error') {
            setError(() => {
                if (result.error.errorCode === "EMAIL_PASSWORD_MISMATCH") {
                    return "Identifiants erronés";
                } else {
                    return result.error.message;
                }
                
            });
        }
    };

    return (
        <section className="grid grid-rows-1fr items-center justify-center min-h-screen">
            <form
                className="grid grid-rows-[2rem_1fr_3rem_3rem_4rem] justify-items-center min-w-52 p-3 gap-8"
                onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                <span className="flex flex-row items-center border-b-2">
                    <h1 className="text-center text-3xl mr-2">Accès anticipé </h1><Emoji text=":locked:" />
                </span>
                <span>
                    <p className="text-center">Munissez-vous des identifiants qui vous ont été transmis dans la lettre de motivation.<br /> Ce compte n&apos;a pas été fait sur mesure.</p>
                    {error ? <hr className="m-5" /> : ""}
                    <p className="text-red-500 text-center">{error}</p>
                </span>
                <input className="primary-input w-full" type='email' placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="primary-input w-full" type='password' placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button id="sign-in-submit-btn" className="primary-btn" type='submit'>Se connecter</button>
            </form>
        </section>
    );
}
