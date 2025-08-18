import NavBar from "@/app/components/navBar";
import { stackServerApp } from "@/stack";
import { StackProvider, StackTheme } from "@stackframe/stack";

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <StackProvider app={stackServerApp}>
            <StackTheme>
                <NavBar />
                <div className="pt-28">{props.children}</div>
            </StackTheme>
        </StackProvider>
    );
}
