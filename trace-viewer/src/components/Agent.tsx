import {FC, useEffect, useState} from "react";
import {agentTrace} from "@/context/TracesContext";
import {Tooltip} from "@mui/material";


interface IAgent {
    time: number;
    trace: agentTrace;
    agentColors: string
    showSignaling?: boolean;
    showInfo?: boolean;
}

const Agent: FC<IAgent> = (props) => {
    const {time, trace, agentColors = "lightgray", showSignaling = true, showInfo = true} = props;
    const [state, setState] = useState<{ x: number, z: number, signaling: boolean, score: number }>({
        x: 0,
        z: 0,
        signaling: false,
        score: 0
    });

    useEffect(() => {
        // check if the time is in the trace
        if (trace.time.indexOf(time) === -1) {
            setState({x: trace.x[0], z: trace.z[0], score: trace.score[0], signaling: trace.signaling[0] === 1});
        } else {
            const index = trace.time.indexOf(time);
            setState({
                x: trace.x[index],
                z: trace.z[index],
                signaling: trace.signaling[index] === 1,
                score: trace.score[index]
            });
        }
    }, [time])


    if (trace.time.indexOf(time) !== -1)
        return (
            <>
                <Tooltip
                    placement="top"
                    title={`id: ${trace.id}\nscore: ${state.score}`}
                    arrow
                    open={showInfo && trace.id !== 0}
                    onOpen={() => null}
                    onClose={() => null}
                >
                    <circle
                        cx={state.x}
                        cy={state.z}
                        r={trace.id == 0 ? "40" : "10"}
                        style={{opacity: trace.id == 0 ? 0.5 : 1}}
                        fill={agentColors}
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

