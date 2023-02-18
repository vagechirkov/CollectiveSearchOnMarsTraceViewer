import {FC, useState} from "react";
import useTraceContext from "@/context/TracesContext";
import Agent from "@/components/Agent";
import {Slider} from "@mui/material";

const colors = [
    "#D5D5D3",
    "#9A8822",
    "#F5CDB4",
    "#74A089",
    "#FDDDA0",
    "#F8AFA8",
]

interface IArena {

}

const Arena: FC<IArena> = (props) => {
    const [time, setTime] = useState<number>(0);
    const {tracesState} = useTraceContext();

    if (tracesState.traces === undefined) return (
        <></>
    );

    return (
        <>
            <svg width="700" height="700" viewBox="-350 -350 700 700">
                <g>
                    {
                        tracesState.traces.map((trace, index) => {
                            return (
                                // <circle cx={trace.x[0]} cy={trace.y[0]} r="5" fill="lightgray"/>
                                <Agent
                                    key={index}
                                    time={trace.time[time]}
                                    trace={trace}
                                    agentColors={colors[index]}
                                />
                            )
                        })
                    }
                </g>
            </svg>
            <Slider
                defaultValue={0}
                aria-label="Default"
                valueLabelDisplay="auto"
                min={0}
                max={tracesState.traces[0].time.length}
                onChange={(event, value) => setTime(value as number)}
            />
        </>
    )
}

export default Arena;