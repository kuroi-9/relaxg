import NavBar from "@/app/components/navBar";
import { stackServerApp } from "@/stack";
import { StackProvider, StackTheme } from "@stackframe/stack";

export const metadata = {
    title: 'RelaxG',
    description:
        'A tool to help with manga upscaling',
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