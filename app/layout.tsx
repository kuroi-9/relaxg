import './globals.css';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import NavBar from "@/components/navBar";

export const metadata = {
    title: 'RelaxG',
    description:
        'Tool that helps to use a manga upscaling model',
};

export default function RootLayout(props: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body><StackProvider app={stackServerApp} lang={'fr-FR'}><StackTheme>
                <div>
                    {props.children}
                </div>
            </StackTheme></StackProvider></body>
        </html>
    );
}
