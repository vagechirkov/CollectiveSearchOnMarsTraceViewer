import {FC} from "react";
import useTraceContext from "@/context/TracesContext";
import Agent from "@/components/Agent";


interface IArena {

}

const Arena: FC<IArena>= (props) => {
    const {tracesState} = useTraceContext();

    if (tracesState.traces === undefined) return (
        <></>
    );

    return (
        <svg width="700" height="700" viewBox="0 0 100 100">
            <g>
                {
                    tracesState.traces.map((trace, index) => {
                        return (
                            // <circle cx={trace.x[0]} cy={trace.y[0]} r="5" fill="lightgray"/>
                          <Agent key={index} trace={trace} time={trace.time[0]} agentColors="lightgray"/>
                        )
                    })
                }
            </g>
        </svg>
    )
}

export default Arena;