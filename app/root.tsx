import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";
import styles from "./tailwind.css?url";
import { json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useEffect } from "react";
import toastStyles from "react-toastify/dist/ReactToastify.css?url";
import { getToast } from "remix-toast";
import { ToastContainer, toast as notify } from "react-toastify";
import { SoundProvider } from "./components/custom/music/SoundContext";
import GlobalMusic from "./components/custom/music/GlobalMusic";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: toastStyles },
    { rel: "stylesheet", href: "/fonts/dogica/dogica.css" },
    { rel: "stylesheet", href: "/fonts/easvhs/easvhs.css" },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap",
    },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // Extracts the toast from the request
    const { toast, headers } = await getToast(request);
    // Important to pass in the headers so the toast is cleared properly
    return json({ toast }, { headers });
};

export function Layout({ children }: { children: React.ReactNode }) {
    // const { toast } = useLoaderData<typeof loader>();

    // useEffect(() => {
    //     if (toast) {
    //         // notify on a toast message
    //   notify(toast.message, { type: toast.type });
    //     }
    // }, [toast]);

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body className="!m-0">
                <SoundProvider>
                    <GlobalMusic />
                    {children}
                </SoundProvider>
                
                {/* <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                ></ToastContainer> */}
                <div id="modal-container" />    
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
