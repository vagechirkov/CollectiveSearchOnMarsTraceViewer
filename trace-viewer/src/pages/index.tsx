import Head from 'next/head'
import {Inter} from '@next/font/google'
import Agent from "@/components/Agent";
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
                <Arena>
                    <>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                                return (
                                    <Agent
                                        key={i}
                                        agentPositions={{x: i*10, y: i*10}}
                                        agentColors="lightgray"
                                    />
                                )
                            })

                        }
                    </>
                </Arena>

            </main>
        </>
    )
}
