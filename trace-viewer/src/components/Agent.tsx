import {FC, useEffect, useState} from "react";
import {agentTrace} from "@/context/TracesContext";


interface IAgent {
    time: number;
    trace: agentTrace;
    agentColors: string

}

const Agent: FC<IAgent> = (props) => {
    const {time, trace, agentColors = "lightgray"} = props;
    const [position, setPosition] = useState<{ x: number, z: number }>({x: 0, z: 0});

    useEffect(() => {
        // check if the time is in the trace
        if (trace.time.indexOf(time) === -1) {
            setPosition({x: trace.x[0], z: trace.z[0]});
        } else {
            const index = trace.time.indexOf(time);
            setPosition({x: trace.x[index], z: trace.z[index]});
        }
    }, [time])


    return (
        <>
            <circle
                cx={position.x}
                cy={position.z}
                r={trace.id == 0 ? "40" : "10"}
                style={{opacity: trace.id == 0 ? 0.5 : 1}}
                fill={agentColors}
            />
        </>

    )
}

export default Agent;

