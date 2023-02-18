import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {TracesContextProvider} from "@/context/TracesContext";


export default function App({Component, pageProps}: AppProps) {
    return (
        <TracesContextProvider>
            <Component {...pageProps} />
        </TracesContextProvider>
    )
}
