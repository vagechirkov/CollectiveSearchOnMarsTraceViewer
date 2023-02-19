import {FC, useEffect, useState} from "react";
import useTraceContext from "@/context/TracesContext";
import Agent from "@/components/Agent";
import {Box, Button, ButtonGroup, Grid, Slider} from "@mui/material";
import {ACTIONS} from "@/context/TracesReducer";
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import {Checkbox} from "@mui/joy";

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

const Arena: FC<IArena> = () => {
    const [time, setTime] = useState<number>(0);
    const {tracesState, tracesDispatcher} = useTraceContext();

    useEffect(() => {
        if (tracesState.traces === undefined && tracesState.files !== undefined && tracesState.files.length > 0)
            tracesDispatcher({type: ACTIONS.ADD_TRACE, payload: {content: tracesState.files[0].content}});
    }, [tracesState.files])

    return (
        <Grid container  direction="column" justifyContent="space-between" spacing={2}>
            <Grid item xs={12} sm={12}
                  // style={{backgroundColor: "lightgray"}}
            >
                <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start" spacing={2} >
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
                            <Typography id="sandwich-group" level="body2" fontWeight="lg" mb={1}>
                                Options
                            </Typography>
                            <Box role="group" aria-labelledby="sandwich-group">
                                <List size="sm">
                                    <ListItem>
                                        <Checkbox label="Lettuce" defaultChecked/>
                                    </ListItem>
                                    <ListItem>
                                        <Checkbox label="Tomato"/>
                                    </ListItem>
                                    <ListItem>
                                        <Checkbox label="Mustard"/>
                                    </ListItem>
                                </List>
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