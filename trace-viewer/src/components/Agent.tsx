import {FC, useEffect, useState} from "react";
import {agentTrace} from "@/context/TracesContext";
import {Tooltip} from "@mui/material";


interface IAgent {
    time: number;
    trace: agentTrace;
    agentColors: string
    showSignaling?: boolean;
    showInfo?: boolean;
    showAgentTrace?: boolean;
    tailLength?: number;
}

const Agent: FC<IAgent> = (props) => {
    const {
        time,
        trace,
        agentColors = "lightgray",
        showSignaling = true,
        showInfo = true,
        showAgentTrace = true,
        tailLength = 1000
    } = props;
    const [showTooltip, setShowTooltip] = useState<boolean>(showInfo);
    const [showTrace, setShowTrace] = useState<boolean>(showAgentTrace);
    const [state, setState] = useState<{ x: number, z: number, signaling: boolean, score: number, tail: number[] }>({
        x: 0,
        z: 0,
        signaling: false,
        score: 0,
        tail: []
    });

    useEffect(() => {
        setShowTrace(showAgentTrace);
    }, [showAgentTrace]);

    useEffect(() => {
        // check if the time is in the trace
        const index = trace.time.indexOf(time);
        if (index === -1) {
            setState({
                x: trace.x[0],
                z: trace.z[0],
                score: trace.score[0],
                signaling: trace.signaling[0] === 1,
                tail: []
            });
        } else {
            // get tail by slicing the trace
            const tail = trace.time.slice(Math.max(0, index - tailLength), index);

            setState({
                x: trace.x[index],
                z: trace.z[index],
                signaling: trace.signaling[index] === 1,
                score: trace.score[index],
                tail: tail.map((t) => trace.time.indexOf(t))
            });
        }
    }, [time, tailLength])


    if (trace.time.indexOf(time) !== -1)
        return (
            <>
                {showTrace && state.tail.map((t, i) => {
                    return <circle
                        key={`${trace.id}-${i}`}
                        cx={trace.x[t]}
                        cy={trace.z[t]}
                        r={1}
                        style={{opacity: 0.5, zIndex: -1}}
                        fill={agentColors}
                    />
                })}
                <Tooltip
                    placement="top"
                    title={`id: ${trace.id}\nscore: ${state.score}`}
                    arrow
                    open={(showTooltip || showInfo) && trace.id !== 0}
                    onOpen={() => null}
                    onClose={() => null}
                    onMouseOver={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <circle
                        cx={state.x}
                        cy={state.z}
                        r={trace.id == 0 ? "40" : "10"}
                        style={{opacity: trace.id == 0 ? 0.3 : 0.6}}
                        fill={agentColors}
                        onClick={() => setShowTrace(!showTrace)}
                    />
                </Tooltip>
                {state.signaling && showSignaling &&
                    <circle cx={state.x} cy={state.z} r={4} fill="red"/>
                }
            </>

        )
    else return null;
}

export default Agent;

