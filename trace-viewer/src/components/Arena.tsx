import React, {FC, useEffect, useState} from "react";
import useTraceContext, {agentTrace} from "@/context/TracesContext";
import Agent from "@/components/Agent";
import {
    Box,
    ButtonGroup, Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid, IconButton, MenuItem, Select,
    Slider, Tooltip
} from "@mui/material";
import {ACTIONS} from "@/context/TracesReducer";
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';


const colors = [
    "#D5D5D3",
    "#74A089",
    "#FDDDA0",
    "#9A8822",
    "#F5CDB4",
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

function estimateSpeed(trace: agentTrace) {
    // calculate the whole distance the agent/resource traveled
    let distance = 0;
    for (let i = 1; i < trace.x.length - 2; i++) {
        distance += Math.sqrt(Math.pow(trace.x[i] - trace.x[i - 1], 2) + Math.pow(trace.z[i] - trace.z[i - 1], 2));
    }
    return distance / (trace.time.length * 0.1);
}

function detectionMarks(traces: agentTrace[]) {
    return traces[0].time.map((resourceTime, index) => {
            // check if any agent detected the resource
            // if (tracesState.traces?.some((trace) => trace.time[index].resources.length > 0)) {

            if (traces?.some((trace) => {
                if (trace.id === 0) return false;

                // get time index
                const timeIndex = trace.time.findIndex((t) => t === resourceTime);

                if (timeIndex === -1) return false;

                return estimateDistanceFromResource(
                    traces[0].x[index], traces[0].z[index],
                    trace.x[timeIndex], trace.z[timeIndex]
                ) < 40;
            })) return (
                {value: index, label: '⚡️'}
            );
        }
    ).filter((value, index, array) => {
        const isCurrentNoUndefined = value !== undefined;
        const isPreviousNotUndefined = index === 0 || array[index - 1] !== undefined;
        const isNextUndefined = index < array.length - 1 && array[index + 1] === undefined;

        // show only unique encounters or lost of the resource
        return isCurrentNoUndefined && !isPreviousNotUndefined || isCurrentNoUndefined && isNextUndefined;
    }) as { value: number, label: string }[]
}

function signalingMarks(resourceTimes: number[], tr: agentTrace) {
    const signaling = resourceTimes.map((resourceTime, index) => {
            const timeIndex = tr.time.findIndex((itime) => itime === resourceTime);
            if (timeIndex !== -1 && tr.signaling[timeIndex] === 1) return {value: index, label: '🚨'};
        }
    )
    return signaling.filter((value, index, array) => {
        const isCurrentNoUndefined = value !== undefined;
        const isPreviousNotUndefined = index === 0 || array[index - 1] !== undefined;
        // check if next is also signaling
        const isNextUndefined = index < array.length - 1 && array[index + 1] === undefined;

        // show only unique encounters or lost of the resource
        return isCurrentNoUndefined && !isPreviousNotUndefined || isCurrentNoUndefined && isNextUndefined;
    }) as { value: number, label: string }[]
}

const Arena: FC<IArena> = () => {
    const [time, setTime] = useState<number>(0);
    const [play, setPlay] = useState<{ isPlaying: boolean, speed: number }>({isPlaying: false, speed: 1});
    const [marks, setMarks] = useState<{ value: number, label: string }[] | false>(false);
    const [tailLength, setTailLength] = useState<number>(100);
    const [options, setOptions] = useState<{ showDetectionMarks: boolean, showSignalingMarks: boolean, showInfo: boolean, showTrace: boolean }>({
        showDetectionMarks: true,
        showSignalingMarks: true,
        showInfo: false,
        showTrace: true
    });
    const {tracesState, tracesDispatcher} = useTraceContext();

    useEffect(() => {
        if (tracesState.traces === undefined && tracesState.files !== undefined && tracesState.files.length > 0) {
            tracesDispatcher({type: ACTIONS.ADD_TRACE, payload: {content: tracesState.files[0].content}});
        }

    }, [tracesState.files])

    useEffect(() => {
        if (tracesState.traces !== undefined) {
            let m = [] as { value: number, label: string }[];
            if (options.showDetectionMarks)
                m = m.concat(detectionMarks(tracesState.traces));
            if (options.showSignalingMarks) {
                // iterate over traces
                tracesState.traces.forEach((t) => {
                    if (t.id > 0 && tracesState.traces !== undefined) {
                        m = m.concat(signalingMarks(tracesState.traces[0].time, t));
                    }
                });
            }
            setMarks(m);
        }

    }, [tracesState.traces, options.showDetectionMarks, options.showSignalingMarks])

    useEffect(() => {
        setTime(0);
    }, [tracesState.traces])

    useEffect(() => {
        if (play.isPlaying && tracesState.traces !== undefined) {
            const interval = setInterval(() => {
                if (time < tracesState.traces![0].time.length - 1)
                    setTime(time + play.speed);
                else {
                    setTime(0);

                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [play.isPlaying, time, play.speed])

    return (
        <Grid container direction="column" justifyContent="space-between" spacing={0}>
            <Grid item xs={12} sm={12}
                // style={{backgroundColor: "lightgray"}}
            >
                <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start" spacing={0}>
                    <Grid item xs={12} sm={8}
                        // style={{backgroundColor: "lightskyblue"}}
                    >
                        <Box display="flex" justifyContent="flex-end">
                            <svg height={550} viewBox="-200 -200 400 400">
                                <g>
                                    <circle cx="0" cy="0" r={`${375 / 2}`} fill="none" stroke="black"/>
                                    {tracesState.traces !== undefined &&
                                        tracesState.traces.map((trace, index) => {
                                            return (
                                                <Agent
                                                    key={index}
                                                    time={tracesState.traces ? tracesState.traces[0].time[time] : 0}
                                                    trace={trace}
                                                    agentColors={colors[index]} showInfo={options.showInfo}
                                                    showAgentTrace={options.showTrace}
                                                    tailLength={tailLength}
                                                />
                                            )
                                        })
                                    }
                                </g>
                            </svg>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}
                        // style={{backgroundColor: "lightseagreen"}}
                    >
                        <Box>
                            <Box>
                                <FormControl sx={{m: 3}} component="fieldset" variant="standard">
                                    {/*<FormLabel component="legend">Resource*/}
                                    {/*    speed: {tracesState.traces && estimateSpeed(tracesState.traces[0])}</FormLabel>*/}
                                    <FormLabel component="legend">Options</FormLabel>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={options.showDetectionMarks}
                                                    onChange={(event) => {
                                                        setOptions({
                                                            ...options,
                                                            showDetectionMarks: event.target.checked
                                                        })
                                                    }}
                                                    name="foundings"/>
                                            }
                                            label="Show detections marks"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={options.showSignalingMarks}
                                                    onChange={(event) => {
                                                        setOptions({
                                                            ...options,
                                                            showSignalingMarks: event.target.checked
                                                        })
                                                    }}
                                                    name="signaling"/>
                                            }
                                            label="Show signaling marks"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={options.showInfo}
                                                    onChange={(event) => {
                                                        setOptions({
                                                            ...options,
                                                            showInfo: event.target.checked
                                                        })
                                                    }}
                                                    name="info"/>
                                            }
                                            label="Show agent info"
                                        />
                                        <Tooltip
                                            title={"Click on agent to show individual trace"}
                                            placement={"bottom"}
                                            arrow
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={options.showTrace}
                                                        onChange={(event) => {
                                                            setOptions({
                                                                ...options,
                                                                showTrace: event.target.checked
                                                            })
                                                        }}
                                                        name="trace"/>
                                                }
                                                label="Show agent trace tail"
                                            /></Tooltip>
                                        <FormControlLabel
                                            labelPlacement="top"
                                            control={
                                                <Slider
                                                    size="small"
                                                    min={0}
                                                    max={tracesState.traces !== undefined ? tracesState.traces[0].time.length - 1 : 0}
                                                    defaultValue={tailLength}
                                                    onChange={(event, value) => setTailLength(value as number)}
                                                    aria-label="Small"
                                                    valueLabelDisplay="auto"
                                                />
                                            }
                                            label="Set tail length"
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
                    value={time}
                    defaultValue={0}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    min={0}
                    max={tracesState.traces !== undefined ? tracesState.traces[0].time.length - 1 : 0}
                    onChange={(event, value) => setTime(value as number)}
                    marks={marks}
                    getAriaValueText={valueLabelFormat}
                    valueLabelFormat={valueLabelFormat}
                />
            </Grid>
            <Grid item xs
                // style={{backgroundColor: "lightgreen"}}
            >
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', '& > *': {m: 1,},}}>
                    <ButtonGroup variant="text" aria-label="text button group">
                        <IconButton
                            onClick={() => setPlay({isPlaying: !play.isPlaying, speed: play.speed})}
                        >
                            {play.isPlaying ?
                                <PauseCircleIcon style={{width: 50, height: 50}}/> :
                                <PlayCircleIcon style={{width: 50, height: 50}}/>}
                        </IconButton>
                        {/* add divider */}
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={play.speed}
                            onChange={(event) => setPlay({
                                isPlaying: play.isPlaying,
                                speed: event.target.value as number
                            })}
                            label="Speed"
                            variant="standard"
                        >
                            <MenuItem value={1}>x1</MenuItem>
                            <MenuItem value={2}>x2</MenuItem>
                            <MenuItem value={5}>x5</MenuItem>
                            <MenuItem value={10}>x10</MenuItem>
                            <MenuItem value={15}>x15</MenuItem>
                            <MenuItem value={20}>x20</MenuItem>
                        </Select>
                    </ButtonGroup>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Arena;