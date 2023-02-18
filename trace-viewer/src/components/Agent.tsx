import {FC, useEffect, useState} from "react";
import {agentTrace} from "@/context/TracesContext";


interface IAgent {
    time: number;
    trace: agentTrace;
    agentColors: string

}

const Agent: FC<IAgent> = (props) => {
    const {time, trace, agentColors = "lightgray"} = props;
    const [position, setPosition] = useState<{ x: number, y: number }>({x: 0, y: 0});

    useEffect(() => {
        // check if the time is in the trace
        if (trace.time.indexOf(time) === -1) {
            setPosition({x: trace.x[0], y: trace.y[0]});
        } else {
            const index = trace.time.indexOf(time);
            setPosition({x: trace.x[index], y: trace.y[index]});
        }

    }, [time])


    return (
        <>
            <circle cx={position.x} cy={position.y} r="5" fill={agentColors}/>
        </>

    )
}

export default Agent;

