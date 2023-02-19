import {FC, useEffect, useState} from "react";
import useTraceContext from "@/context/TracesContext";
import Agent from "@/components/Agent";
import {
    Box,
    Button,
    ButtonGroup, Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Slider
} from "@mui/material";
import {ACTIONS} from "@/context/TracesReducer";


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

function valueLabelFormat(value: number) {
    const millis = value * 100;
    // convert to m:s.ms
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(0)}.${(millis % 1000 / 100).toFixed(0)}`;
}

function estimateDistanceFromResource(x_resource: number, z_resource: number, x_agent: number, z_agent: number) {
    return Math.sqrt(Math.pow(x_agent - x_resource, 2) + Math.pow(z_agent - z_resource, 2));
}

const Arena: FC<IArena> = () => {
    const [time, setTime] = useState<number>(0);
    const {tracesState, tracesDispatcher} = useTraceContext();

    useEffect(() => {
        if (tracesState.traces === undefined && tracesState.files !== undefined && tracesState.files.length > 0)
            tracesDispatcher({type: ACTIONS.ADD_TRACE, payload: {content: tracesState.files[0].content}});
    }, [tracesState.files])

    return (
        <Grid container direction="column" justifyContent="space-between" spacing={2}>
            <Grid item xs={12} sm={12}
                // style={{backgroundColor: "lightgray"}}
            >
                <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start" spacing={2}>
                    <Grid item xs={12} sm={9}
                        // style={{backgroundColor: "lightskyblue"}}
                    >
                        <Box display="flex" justifyContent="flex-end">
                            <svg height={550} viewBox="-200 -200 400 400">
                                <g>
                                    <circle cx="0" cy="0" r={`${375 / 2}`} fill="none" stroke="black"/>
                                    {tracesState.traces !== undefined &&
                                        tracesState.traces.map((trace, index) => {
                                            return (
                                                <Agent key={index} time={trace.time[time]} trace={trace}
                                                       agentColors={colors[index]}/>
                                            )
                                        })
                                    }
                                </g>
                            </svg>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}
                        // style={{backgroundColor: "lightseagreen"}}
                    >
                        <Box>
                            <Box>
                                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                    <FormLabel component="legend">Options</FormLabel>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    // checked={gilad}
                                                    // onChange={handleChange}
                                                    name="founding" />
                                            }
                                            label="Show detections"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    // checked={jason}
                                                    // onChange={handleChange}
                                                    name="signaling" />
                                            }
                                            label="Show signaling"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    // checked={antoine}
                                                    // onChange={handleChange}
                                                    name="score" />
                                            }
                                            label="Show score"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs
                // style={{backgroundColor: "lightcoral"}}
            >
                <Slider
                    defaultValue={0}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    min={0}
                    max={tracesState.traces !== undefined ? tracesState.traces[0].time.length - 1 : 0}
                    onChange={(event, value) => setTime(value as number)}
                    marks={tracesState.traces !== undefined && tracesState.traces[0].time.length > 0 ?
                        (
                            tracesState.traces[0].time.map((time, index) => {
                                    // check if any agent detected the resource
                                    // if (tracesState.traces?.some((trace) => trace.time[index].resources.length > 0)) {

                                    if (tracesState.traces?.some((trace) => {
                                        if (trace.id === 0) return false;

                                        // get time index
                                        const timeIndex = trace.time.findIndex((t) => t ===time);

                                        if (timeIndex === -1) return false;
                                        if (tracesState.traces === undefined) return false;

                                        return estimateDistanceFromResource(
                                            tracesState.traces[0].x[index], tracesState.traces[0].z[index],
                                            trace.x[timeIndex], trace.z[timeIndex]
                                        ) < 40;
                                    })) return (
                                        {value: index, label: '⚡️'}
                                    );
                                }
                            ).filter((value, index, array) => {
                                const isCurrentNoUndefined = value !== undefined;
                                const isPreviousNotUndefined = index === 0 || array[index - 1] !== undefined;
                                // show only unique encounters or lost of the resource
                                return isCurrentNoUndefined && !isPreviousNotUndefined;
                            }) as { value: number, label: string }[]
                            //     [{value: 0, label: "0"}] as { value: number, label: string }[]
                        ) : false
                    }
                    getAriaValueText={valueLabelFormat}
                    valueLabelFormat={valueLabelFormat}
                />
            </Grid>
            <Grid item xs
                // style={{backgroundColor: "lightgreen"}}
            >
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', '& > *': {m: 1,},}}>
                    <ButtonGroup variant="text" aria-label="text button group">
                        <Button>One</Button>
                        <Button>Two</Button>
                        <Button>Three</Button>
                    </ButtonGroup>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Arena;