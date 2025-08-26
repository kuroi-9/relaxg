"use client";

import { useStackApp } from "@stackframe/stack";
import { useState, useRef } from "react";
import "@/app/sign-in/sign-in.css";
import { LockerIcon } from "@/app/icons/global";
import { CheckMarkIconWhite } from "@/app/icons/global";

export default function CredentialSignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const app = useStackApp();
    const authenticated = useRef(false);

    const onSubmit = async () => {
        setIsLoading(true);
        if (!password) {
            setError("Merci d'entrer le mot de passe");
            setIsLoading(false);
            return;
        }
        // this will redirect to app.urls.afterSignIn if successful, you can customize it in the StackServerApp constructor
        const result = await app.signInWithCredential({ email, password });
        // It is better to handle each error code separately, but we will just show the error code directly for simplicity here
        if (result.status === "error") {
            setIsLoading(false);
            setError(() => {
                if (result.error.errorCode === "EMAIL_PASSWORD_MISMATCH") {
                    return "Identifiants erronés";
                } else {
                    return result.error.message;
                }
            });
            setIsLoading(false);
            console.log("Error occurred during sign-in");
        } else {
            authenticated.current = true;
        }
    };

    return (
        <section className="grid grid-rows-1fr items-center justify-center mt-10 md:mt-32 mb-32">
            <form
                className="grid grid-rows-[2rem_1fr_3rem_3rem] justify-items-center min-w-52 p-3 gap-8"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <span className="flex flex-row items-center border-b-2">
                    <h1 className="text-center text-3xl mr-2">
                        Accès anticipé{" "}
                    </h1>
                    <LockerIcon />
                </span>
                <span>
                    <p className="text-center">
                        Si vous disposez d&apos;identifiants de démonstration,
                        vous pouvez vous connecter ici.
                    </p>
                    <br />
                    <p className="text-center max-w-2xl">
                        Dans le cadre du beta-test et de la température
                        estivale, tout job démarré peut être interrompu, le
                        processus étant extrêment couteux en ressources.
                    </p>
                    {error ? <hr className="m-5" /> : ""}
                    <p className="text-red-500 text-center">{error}</p>
                </span>
                <input
                    className="primary-input w-full"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div
                    className="grid grid-rows-[3rem_auto_3rem] w-full"
                    style={{ rowGap: "1rem" }}
                >
                    <input
                        className="primary-input w-full"
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex justify-center">
                        <hr
                            className="border-2 w-28 rounded-full"
                            style={{ borderColor: "var(--foreground)" }}
                        />
                    </div>
                    {isLoading ? (
                        <button
                            disabled
                            className={
                                "w-full primary-btn undefined-btn flex justify-center items-center border-2 p-2 shrink-0"
                            }
                            style={{
                                minHeight: "48px",
                                maxHeight: "48px",
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                paddingTop: "0px",
                                paddingBottom: "0px",
                                borderRadius: "0",
                                outline: "none",
                                color: "white",
                                backgroundColor: "#171717",
                            }}
                        >
                            <div className="loader-white" />
                        </button>
                    ) : authenticated.current ? (
                        <button
                            disabled
                            className={
                                "w-full primary-btn undefined-btn flex justify-center items-center border-2 p-2 shrink-0"
                            }
                            style={{
                                minHeight: "48px",
                                maxHeight: "48px",
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                paddingTop: "0px",
                                paddingBottom: "0px",
                                borderRadius: "0",
                                outline: "none",
                                color: "white",
                                backgroundColor: "#171717",
                            }}
                        >
                            <CheckMarkIconWhite />
                        </button>
                    ) : (
                        <button
                            id="sign-in-submit-btn"
                            className="primary-btn w-full"
                            type="submit"
                            style={{
                                minHeight: "48px",
                                maxHeight: "48px",
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                paddingTop: "0px",
                                paddingBottom: "0px",
                                borderRadius: "0",
                                color: "white",
                                backgroundColor: "#171717",
                            }}
                        >
                            Se connecter
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}
