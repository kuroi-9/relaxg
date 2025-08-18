import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html>
            <body>
                <StackProvider app={stackServerApp} lang={"fr-FR"}>
                    <StackTheme>
                        <div>{props.children}</div>
                    </StackTheme>
                </StackProvider>
            </body>
        </html>
    );
}
