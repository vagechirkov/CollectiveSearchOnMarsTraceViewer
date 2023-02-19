import React, {FC, useEffect, useState} from "react";
import useTraceContext, {agentTrace, TracesState} from "@/context/TracesContext";
import Agent from "@/components/Agent";
import {
    Box,
    Button,
    ButtonGroup, Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid, IconButton, MenuItem, Select,
    Slider
} from "@mui/material";
import {ACTIONS} from "@/context/TracesReducer";
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CircleIcon from '@mui/icons-material/Circle';


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

function detectionMarks(traces: agentTrace[]) {
    return traces[0].time.map((time, index) => {
            // check if any agent detected the resource
            // if (tracesState.traces?.some((trace) => trace.time[index].resources.length > 0)) {

            if (traces?.some((trace) => {
                if (trace.id === 0) return false;

                // get time index
                const timeIndex = trace.time.findIndex((t) => t === time);

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
        // show only unique encounters or lost of the resource
        return isCurrentNoUndefined && !isPreviousNotUndefined;
    }) as { value: number, label: string }[]
}

const Arena: FC<IArena> = () => {
    const [time, setTime] = useState<number>(0);
    const [play, setPlay] = useState<{ isPlaying: boolean, speed: number }>({isPlaying: false, speed: 1});
    const [marks, setMarks] = useState<{ value: number, label: string }[] | false>(false);
    const [options, setOptions] = useState<{ showDetectionMarks: boolean, showSignalingMarks: boolean }>({
        showDetectionMarks: true,
        showSignalingMarks: false
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
            if(options.showDetectionMarks)
                m = m.concat(detectionMarks(tracesState.traces));
            // if(options.showSignalingMarks)
            //     m = m.concat(signalingMarks(tracesState.traces));
            setMarks(m);
        }

    }, [tracesState.traces, options.showDetectionMarks])

    useEffect(() => {
        if (play.isPlaying && tracesState.traces !== undefined) {
            const interval = setInterval(() => {
                if (time < tracesState.traces![0].time.length - 1)
                    setTime(time + 1);
                else
                    setTime(0);
            }, 100 / play.speed);
            return () => clearInterval(interval);
        }
    }, [play.isPlaying, time, play.speed])

    return (
        <Grid container direction="column" justifyContent="space-between" spacing={0}>
            <Grid item xs={12} sm={12}
                // style={{backgroundColor: "lightgray"}}
            >
                <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start" spacing={0}>
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
                                <FormControl sx={{m: 3}} component="fieldset" variant="standard">
                                    <FormLabel component="legend">Options</FormLabel>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={options.showDetectionMarks}
                                                    onChange={(event) => {setOptions({...options, showDetectionMarks: event.target.checked})}}
                                                    name="foundings"/>
                                            }
                                            label="Show detections"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={options.showSignalingMarks}
                                                    onChange={(event) => {setOptions({...options, showSignalingMarks: event.target.checked})}}
                                                    name="signaling"/>
                                            }
                                            label="Show signaling"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    // checked={antoine}
                                                    // onChange={handleChange}
                                                    name="score"/>
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
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={play.speed}
                            onChange={(event) => setPlay({
                                isPlaying: play.isPlaying,
                                speed: event.target.value as number
                            })}
                            autoWidth
                            label="Speed"
                        >
                            <MenuItem value={1}><em>x1</em></MenuItem>
                            <MenuItem value={2}><em>x2</em></MenuItem>
                            <MenuItem value={5}><em>x5</em></MenuItem>
                            <MenuItem value={10}><em>x10</em></MenuItem>
                        </Select>
                    </ButtonGroup>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Arena;