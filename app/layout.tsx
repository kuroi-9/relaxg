import './globals.css';
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
        <body>
        <NavBar></NavBar>
        {props.children}
        </body>
        </html>
    );
}
