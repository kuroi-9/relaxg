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
        <div className="pt-28">
            {props.children}
        </div>
        </body>
        </html>
    );
}
