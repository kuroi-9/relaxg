'use client'

import Form from 'next/form';
import "../globals.css";

export default function LoginPage(this: any) {

    function handleSubmit(formData: any) {        
        try {
            fetch(`http://100.126.28.1:8082/auth/verify`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"passcode": formData.get('passcode-input')}),
            })
        } catch (error) {
            console.log("[ERROR SUBMITTING LOGIN FORM] : " + error);
        };

        

    };

    

    return (
        <section className="flex justify-center h-64">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-6xl underline">Accéder à l'application</h1>
                <form action={handleSubmit} className="flex flex-col mt-2 w-full">

                    <section className="flex flex-col mt-2 border-2 items-center w-full">
                        <label className="text-2xl" htmlFor="passcode-input">Votre code d'accès réutilisable</label>
                        <input
                            id="passcode-input"
                            className="login-input w-full bg-black border-t-2"
                            name="passcode-input" type="text"
                            placeholder="Code de 18 caractères"></input>
                    </section>

                    <button className="submit-btn mt-2 border-2 w-auto">Connexion</button>
                </form>
            </div>
        </section>
    )
}