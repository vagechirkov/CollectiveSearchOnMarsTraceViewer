import Head from 'next/head'
import {Inter} from '@next/font/google'
import Arena from "@/components/Arena";
import TraceReader from "@/components/TraceReader";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    return (
        <>
            <Head>
                <title>Trace Viewer</title>
                <meta name="description" content="Collective Search Experiment Trace Viewer"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main>
                <TraceReader/>
                <Arena/>
            </main>
        </>
    )
}
