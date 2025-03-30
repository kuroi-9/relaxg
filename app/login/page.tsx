"use client";

import "../globals.css";
import { useUser } from "@stackframe/stack";

export default function LoginPage(this: any) {
    const user = useUser({ or: "redirect" });

    function handleSubmit(formData: any) {
        try {
            user.getAuthJson().then((res) => {
                fetch(`https://api.relaxg.app/auth/verify`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "x-stack-access-token": res.accessToken ?? "",
                    },
                    body: JSON.stringify({
                        passcode: formData.get("passcode-input"),
                    }),
                });
            });
        } catch (error) {
            console.log("[ERROR SUBMITTING LOGIN FORM] : " + error);
        }
    }

    return (
        <section className="flex justify-center h-64">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-6xl underline">
                    Accéder à l&apos;application
                </h1>
                <form
                    action={handleSubmit}
                    className="flex flex-col mt-2 w-full"
                >
                    <section className="flex flex-col mt-2 border-2 items-center w-full">
                        <label className="text-2xl" htmlFor="passcode-input">
                            Votre code d&apos;accès réutilisable
                        </label>
                        <input
                            id="passcode-input"
                            className="login-input w-full bg-black border-t-2"
                            name="passcode-input"
                            type="text"
                            placeholder="Code de 18 caractères"
                        ></input>
                    </section>

                    <button className="submit-btn mt-2 border-2 w-auto">
                        Connexion
                    </button>
                </form>
            </div>
        </section>
    );
}
