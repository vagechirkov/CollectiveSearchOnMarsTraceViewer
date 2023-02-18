import {agentTrace, TracesState} from "@/context/TracesContext";

export const ACTIONS = {
    ADD_TRACE: 'ADD_TRACE',
}

const tracesReducer = (state: TracesState, action: any) => {
    switch (action.type) {
        case ACTIONS.ADD_TRACE:
            // parse the text file with traces
            const agents = parseTrace(action.payload.content);
            agents.map((trace, index) => console.log(trace.x, trace.z))
            return {
                ...state,
                traces: agents
            }

        default:
            return state;
    }
}

const parseTrace = (trace: string) => {
    const lines = trace.split('\n');
    let agentTraces: agentTrace[] = [];

    // const vars = lines[0].split(' ');
    lines.forEach((line, index) => {
            if (index === 0) {
                // vars
            } else {
                // time, id, x, z, y, signaling, score
                const values = line.split(' ');

                // continue if id is not a number
                if (isNaN(parseInt(values[1]))) return;

                // find id of the agent traces
                let agentTraceInx = agentTraces.findIndex((trace) => trace.id === parseInt(values[1]));

                // if agent trace does not exist, create it
                if (agentTraceInx === -1) {
                    agentTraces.push({
                        id: parseInt(values[1]),
                        time: [],
                        x: [],
                        z: [],
                        rotation: [],
                        signaling: [],
                        score: []
                    })
                    agentTraceInx = agentTraces.length - 1;
                }

                // add values to agentTrace
                agentTraces[agentTraceInx].time.push(parseInt(values[0]));
                agentTraces[agentTraceInx].x.push(parseInt(values[2]));
                agentTraces[agentTraceInx].z.push(parseInt(values[3]));
                agentTraces[agentTraceInx].rotation.push(parseInt(values[4]));
                agentTraces[agentTraceInx].signaling.push(parseInt(values[5]));
                agentTraces[agentTraceInx].score.push(parseInt(values[6]));
            }
        }
    )
    return agentTraces;
}

export default tracesReducer;