import NavBar from "@/components/navBar";
import { stackServerApp } from "@/stack";
import { StackProvider, StackTheme } from "@stackframe/stack";

export const metadata = {
    title: 'RelaxG',
    description:
        'Tool that helps to use a manga upscaling model',
};

export default function RootLayout(props: {
    children: React.ReactNode;
}) {
    return (
        <StackProvider app={stackServerApp}><StackTheme>
            <NavBar></NavBar>
            <div className="pt-28">
                {props.children}
            </div>
        </StackTheme></StackProvider>
    );
}